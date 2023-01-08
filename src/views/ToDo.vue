<!--
一个完全标准的 TodoMVC 实现
https://todomvc.com/
-->
<script setup lang="ts">
import { reactive, ref, toRaw, watch, watchEffect } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
const hash = route.hash.replace(/#\/?/, '');
// console.log(hash);

const STORAGE_KEY = 'wzblog-vue-todomvc';

interface ToDoType {
  id: number;
  title: string;
  completed: boolean;
};

// 初始化应用状态
const todos: ToDoType[] = reactive(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
const isAllCompleted = ref(false);
const currTodoTitle = ref("");
const remaining = ref(0);
enum visibilityEnum { all = "all", active = "active", completed = "completed" };
const visibility = ref(hash);
const filteredTodos = ref(todos);

let beforeEditCache: string;
const editedTodo = ref();

const todoFilters = (visibilityValue: string = visibilityEnum.all): ToDoType[] => {
  // console.log(visibilityValue);
  switch (visibilityValue) {
    case visibilityEnum.active: return todos.filter((todo) => !todo.completed);
    case visibilityEnum.completed: return todos.filter((todo) => todo.completed);
    case visibilityEnum.all: default: return [...todos];
  }
};

// 侦听 todos 的变化，以通过 localStorage 持久化
watch(
  todos,
  todos => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)),
);

watchEffect(() => {
  // console.log("watchEffect");
  filteredTodos.value = todoFilters(visibility.value);
  remaining.value = todoFilters(visibilityEnum.active).length;
});


// 数据逻辑的方法实现。
// 注意这里没有 DOM 操作。
const toggleAll = () => todos.forEach(todo => todo.completed = isAllCompleted.value);

const addTodo = () => {
  const value = currTodoTitle.value.trim();
  if (!value) return;
  todos.push({
    id: Date.now(),
    title: value,
    completed: false,
  })
  currTodoTitle.value = '';
};

const removeTodo = (todo: ToDoType) => {
  todos.splice(todos.indexOf(todo), 1)
};

const editTodo = (todo: ToDoType) => {
  // console.log("editTodo");
  beforeEditCache = todo.title;
  editedTodo.value = toRaw(todo);
  // console.log(editedTodo.value);
};

const doneEdit = (todo: ToDoType) => {
  // console.log("doneEdit");
  if (!editedTodo.value) return;
  todo.title = editedTodo.value.title.trim();
  if (!todo.title) {
    removeTodo(todo);
  }
  // console.log(todo.title);
  editedTodo.value = null;
};

const cancelEdit = (todo: ToDoType) => {
  // console.log("cancelEdit");
  // console.log(beforeEditCache);
  todo.title = beforeEditCache;
  editedTodo.value = null;
};

const removeCompleted = () => {
  todoFilters(visibilityEnum.completed).forEach(completed => removeTodo(completed));
};

onBeforeRouteUpdate((to, from) => {
  // console.log(to.hash);
  // console.log(from.hash);
  visibility.value = to.hash.replace(/#\/?/, '');
});

</script>

<template>
  <breadcrumb />
  <div id="todo_container">
    <section class="todoapp">
      <header class="header">
        <h1>ToDos</h1>
        <input class="new-todo" placeholder="有什么需要完成的?" v-model="currTodoTitle" @keyup.enter="addTodo">
      </header>
      <section class="main" v-show="todos.length">
        <input id="toggle-all" class="toggle-all" type="checkbox" v-model="isAllCompleted" @change="toggleAll">
        <label for="toggle-all">全部标记为已完成</label>
        <ul class="todo-list">
          <li v-for="todo in filteredTodos" class="todo" :key="todo.id"
            :class="{ completed: todo.completed, editing: toRaw(todo) === toRaw(editedTodo) }">
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.completed">
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input v-if="toRaw(todo) === toRaw(editedTodo)" class="edit" type="text" v-model="editedTodo.title"
              @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.escape="cancelEdit(todo)">
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todos.length">
        <span class="todo-count">
          <strong>{{ remaining }}</strong>
          <span> 项待办</span>
        </span>
        <ul class="filters">
          <li>
            <a href="todo#all" :class="{ selected: visibility === 'all' }">全部</a>
          </li>
          <li>
            <a href="todo#active" :class="{ selected: visibility === 'active' }">待办</a>
          </li>
          <li>
            <a href="todo#completed" :class="{ selected: visibility === 'completed' }">完成</a>
          </li>
        </ul>
        <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
          清空已完成
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
@import "~/styles/todo/index.css";
</style>