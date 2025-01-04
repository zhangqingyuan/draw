import { useState, useEffect, useRef } from 'react';

export const useAudioControl = (bgMusic, rollMusic, winMusic) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const bgAudioRef = useRef(null);
  const rollAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const currentPlayingRef = useRef(null);

  // 初始化音频
  useEffect(() => {
    const initAudio = () => {
      bgAudioRef.current = new Audio(bgMusic);
      rollAudioRef.current = new Audio(rollMusic);
      winAudioRef.current = new Audio(winMusic);

      // 设置基本属性
      bgAudioRef.current.loop = true;
      rollAudioRef.current.loop = true;
      
      // 设置音量
      bgAudioRef.current.volume = isMuted ? 0 : volume;
      rollAudioRef.current.volume = isMuted ? 0 : 0.7;
      winAudioRef.current.volume = isMuted ? 0 : 0.8;

      // 开始播放背景音乐
      bgAudioRef.current.play().catch(console.error);
      currentPlayingRef.current = bgAudioRef.current;
    };

    initAudio();

    // 监听中奖音效结束事件
    const handleWinMusicEnd = () => {
      if (bgAudioRef.current && !isMuted) {
        bgAudioRef.current.play().catch(console.error);
        currentPlayingRef.current = bgAudioRef.current;
      }
    };

    if (winAudioRef.current) {
      winAudioRef.current.addEventListener('ended', handleWinMusicEnd);
    }

    // 清理函数
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
      if (rollAudioRef.current) {
        rollAudioRef.current.pause();
      }
      if (winAudioRef.current) {
        winAudioRef.current.removeEventListener('ended', handleWinMusicEnd);
        winAudioRef.current.pause();
      }
    };
  }, [bgMusic, rollMusic, winMusic]);

  // 更新音量
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = isMuted ? 0 : volume;
    }
    if (rollAudioRef.current) {
      rollAudioRef.current.volume = isMuted ? 0 : 0.7;
    }
    if (winAudioRef.current) {
      winAudioRef.current.volume = isMuted ? 0 : 0.8;
    }
  }, [isMuted, volume]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playRollMusic = () => {
    if (!rollAudioRef.current) return;

    // 暂停当前播放的音频
    currentPlayingRef.current?.pause();

    // 重置并播放滚动音效
    rollAudioRef.current.currentTime = 0;
    const playPromise = rollAudioRef.current.play();
    
    if (playPromise) {
      playPromise.catch(error => {
        console.error('播放滚动音效失败:', error);
        // 如果播放失败，尝试恢复背景音乐
        if (bgAudioRef.current && !isMuted) {
          bgAudioRef.current.play().catch(console.error);
          currentPlayingRef.current = bgAudioRef.current;
        }
      });
    }
    
    currentPlayingRef.current = rollAudioRef.current;
  };

  const playWinMusic = () => {
    if (!winAudioRef.current) return;

    // 暂停当前播放的音频
    currentPlayingRef.current?.pause();

    // 重置并播放中奖音效
    winAudioRef.current.currentTime = 0;
    const playPromise = winAudioRef.current.play();
    
    if (playPromise) {
      playPromise.catch(error => {
        console.error('播放中奖音效失败:', error);
        // 如果播放失败，尝试恢复背景音乐
        if (bgAudioRef.current && !isMuted) {
          bgAudioRef.current.play().catch(console.error);
          currentPlayingRef.current = bgAudioRef.current;
        }
      });
    }
    
    currentPlayingRef.current = winAudioRef.current;
  };

  return {
    isMuted,
    toggleMute,
    playRollMusic,
    playWinMusic
  };
}; 