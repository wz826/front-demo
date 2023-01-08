// 使用 Web Audio API
const baseUrl = import.meta.env.VITE_BASE_URL;

interface VoiceType {
  readonly audioBuffer: AudioBuffer;
  readonly gainNode: GainNode;
  readonly volume: number;
  readonly loop: boolean;
  sourceNode?: AudioBufferSourceNode;
}

interface MusicType {
  /**
   *  静音
   * @param muted 默认为true
   */
  mute(muted?: boolean): void;
  pause(paused?: boolean): void;
  bgPlay(): void;
  actionPlay(): void;
  gameOverPlay(): void;
  top10Play(): void;
  lineClearPlay(): void;
  levelUpPlay(): void;
  fallPlay(): void;
  rotatePlay(): void;
}

class Music implements MusicType {
  private static readonly bgUrl = `${baseUrl}audio/game/tetris/background.mp3`;
  private static readonly actUrl = `${baseUrl}audio/game/tetris/downBottom.mp3`;
  private static readonly ggUrl = `${baseUrl}audio/game/tetris/gameover.wav`;
  private static readonly lcUrl = `${baseUrl}audio/game/tetris/lineClear.wav`;
  private static readonly luUrl = `${baseUrl}audio/game/tetris/levelUp.mp3`;
  private static readonly top10Url = `${baseUrl}audio/game/tetris/top10.mp3`;
  /**
   * 移动    0, 2.9088, 0.1437
   * 旋转    0, 2.2471, 0.0807
   * 游戏结束 0, 8.1276, 1.1437
   * 立即下落 0, 1.2558, 0.3546
   * 消除方块 0, 0,      0.7675
   * 游戏开始 0, 3.7202, 3.6224
   */
  private static readonly tetrisUrl = `${baseUrl}audio/game/tetris/tetris.mp3`;
  private readonly audioContext: AudioContext;
  private voiceBg: VoiceType | undefined;
  private voiceAct: VoiceType | undefined;
  private voiceGg: VoiceType | undefined;
  private voiceTop10: VoiceType | undefined;
  private voiceLc: VoiceType | undefined;
  private voiceLu: VoiceType | undefined;
  private voiceFall: VoiceType | undefined;
  private voiceRotate: VoiceType | undefined;
  private voices: VoiceType[] = [];
  private isPaused = false;
  private isMuted = false;
  constructor(audioCtx: AudioContext) {
    this.audioContext = audioCtx;
    this.init();
  }
  private async init(): Promise<void> {
    const tetrisBf: AudioBuffer = await this.getAudioBuffer(Music.tetrisUrl);
    this.voiceBg = await this.getVoice(Music.bgUrl, 0.25, true);
    this.bgPlay();
    this.voiceAct = await this.getVoice(Music.actUrl, 0.23);
    this.voiceGg = await this.getVoice(Music.ggUrl, 0.5);
    this.voiceTop10 = await this.getVoice(Music.top10Url, 0.7);
    this.voiceLc = await this.getVoice(Music.lcUrl, 0.5);
    this.voiceLu = await this.getVoice(Music.luUrl, 0.7);
    this.voiceFall = await this.getVoice(tetrisBf, 0.9);
    this.voiceRotate = await this.getVoice(tetrisBf, 0.6);
  }
  pause(paused: boolean = true): void {
    this.isPaused = paused;
    paused ? this.audioContext.suspend() : this.audioContext.resume();
  }
  mute(muted: boolean = true): void {
    this.isMuted = muted;
    this.voices.forEach(voice => voice.gainNode.gain.value = muted ? 0 : voice.volume);
  }
  // TODO 怎么在准备好后播放？
  bgPlay(): void {
    if (this.voiceBg?.sourceNode) return;
    this.voiceGg?.sourceNode?.disconnect();
    this.voiceTop10?.sourceNode?.disconnect();
    this.startVoice(this.voiceBg);
  }
  actionPlay(): void {
    this.startVoice(this.voiceAct, [0, 0.282, 0.221])
  }
  gameOverPlay(): void {
    this.bgStop();
    this.startVoice(this.voiceGg, [0, 0.001, 1.335]);
  }
  top10Play(): void {
    this.bgStop();
    this.startVoice(this.voiceTop10, [0, 0.268, 6.168]);
  }
  lineClearPlay(): void {
    this.startVoice(this.voiceLc, [0, 0.039, 0.651])
  }
  levelUpPlay(): void {
    this.startVoice(this.voiceLu, [0, 0.265, 1.001])
  }
  fallPlay(): void {
    this.startVoice(this.voiceFall, [0, 1.2558, 0.3546])
  }
  rotatePlay(): void {
    this.startVoice(this.voiceRotate, [0, 2.2471, 0.0807])
  }
  private bgStop() {
    this.voiceBg?.sourceNode?.disconnect();
    this.voiceBg!.sourceNode = undefined;
  }
  private startVoice(voice: VoiceType | undefined, startParams: [number, number?, number?] = [0]): void {
    if (!voice || this.isMuted || this.isPaused) return;
    voice.sourceNode?.disconnect();
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = voice.audioBuffer;
    sourceNode.loop = voice.loop;
    sourceNode.connect(voice.gainNode);
    sourceNode.start(...startParams);
    voice.sourceNode = sourceNode;
  };
  private async getVoice(data: AudioBuffer | string, volume: number = 0.6,
    loop: boolean = false): Promise<VoiceType> {
    let audioBuffer: AudioBuffer;
    if (typeof data === "string" || data instanceof String) {
      audioBuffer = await this.getAudioBuffer(data as string);
    } else {
      audioBuffer = data;
    }
    const gainNode = this.audioContext.createGain();
    gainNode.connect(this.audioContext.destination);
    gainNode.gain.value = volume;
    const voice: VoiceType = { audioBuffer, gainNode, volume, loop, };
    this.voices.push(voice);
    return voice;
  }
  private async getAudioBuffer(url: string): Promise<AudioBuffer> {
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    // console.log(arrayBuffer.byteLength);
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }
} // end class Music

const useMusic = async (audioCtx: AudioContext): Promise<MusicType> => {
  const music: MusicType = new Music(audioCtx);
  return music;
};

export { useMusic };
export type { MusicType };
