import React, { useState, useRef } from 'react';
import { Button, message, Select, Modal, InputNumber, Slider } from 'antd';
import { 
  CloseOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  SoundOutlined,
  SoundFilled
} from '@ant-design/icons';
import styled, { css } from 'styled-components';
import bgImage from './pics/bg.jpg';
import bgMusic from './music/背景音乐.wav';
import rollMusic from './music/滚动音乐.wav';
import winMusic from './music/中奖音乐.wav';
import { useAudioControl } from './hooks/useAudioControl';

const AppContainer = styled.div`
  min-height: 100vh;
  background: url(${bgImage}) no-repeat center center fixed;
  background-size: cover;
  padding: 20px;
  color: white;
  position: relative;
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const Header = styled.div`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 0 20px;
`;

const DrawBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  max-width: 800px;
`;

const PrizeBox = styled.div`
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #ff1a1a 0%, #cc0000 100%);
  border-radius: 20px;
  position: relative;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DrawNumber = styled.div`
  font-size: 120px;
  font-weight: bold;
  text-align: center;
  color: #ffd700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  height: 140px;
  line-height: 140px;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
  
  ${props => props.isDrawing && css`
    transform: scale(1.1);
  `}
`;

const BottomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
`;

const PrizeSelect = styled(Select)`
  &.ant-select {
    width: 150px;
    
    .ant-select-selector {
      background: rgba(0, 0, 0, 0.3) !important;
      border: none !important;
      color: #fff !important;
    }
  }
`;

const StartButton = styled(Button)`
  &.ant-btn {
    height: 40px;
    padding: 0 30px;
    background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
    border: none;
    font-size: 18px;
    font-weight: bold;
    color: #8b0000;
    
    &:hover {
      background: linear-gradient(135deg, #ffe44d 0%, #ffbb33 100%);
    }
  }
`;

const ParticipantCount = styled.div`
  color: #ffd700;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &::before {
    content: '参与人数:';
    color: #fff;
  }
`;

const WinnerList = styled.div`
  width: 300px;
  background: rgba(153, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

const WinnerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    
    .delete-button {
      opacity: 1;
    }
  }
  
  .delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: #ff4d4f;
    cursor: pointer;
    
    &:hover {
      color: #ff7875;
    }
  }
`;

const WinnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  .prize-name {
    color: #ffd700;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .number {
    color: #fff;
  }
`;

const SoundButton = styled(Button)`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none !important;
  border: none !important;
  padding: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1000;
  
  &:hover {
    background: none !important;
    transform: scale(1.1);
    opacity: 0.8;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::after {
    display: none !important;
  }
  
  .anticon {
    font-size: 24px;
    color: #fff;
  }
`;

const NumberRangeModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
  }
  
  .ant-modal-header {
    background: none;
    border-bottom: none;
  }
  
  .ant-modal-title {
    color: #fff;
  }
  
  .ant-modal-body {
    padding: 20px;
    
    .range-inputs {
      display: flex;
      gap: 20px;
      align-items: center;
      
      span {
        color: #fff;
      }
    }
  }
`;

const MuteIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .sound-icon {
    color: #fff;
    font-size: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 24px;
    background-color: #fff;
    transform: rotate(45deg);
    left: 50%;
  }
`;

// Add number formatting utility function
const formatNumber = (num) => {
  return num?.toString().padStart(3, '0') || '???';
};

function App() {
  const [participants, setParticipants] = useState([]);
  const [currentPrize, setCurrentPrize] = useState('一等奖');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [winners, setWinners] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [numberRange, setNumberRange] = useState({ start: 1, end: 100 });
  const animationRef = useRef(null);
  const displayNumberRef = useRef(null);

  // 使用音频控制hook
  const { isMuted, toggleMute, playRollMusic, playWinMusic } = useAudioControl(
    bgMusic,
    rollMusic,
    winMusic
  );

  // 开始抽奖
  const startDraw = async () => {
    if (participants.length === 0) {
      message.error('请先生成抽奖号码');
      return;
    }

    // 获取可用号码
    const availableNumbers = participants.filter(
      num => !winners.some(winner => winner.number === num)
    );

    if (availableNumbers.length === 0) {
      message.error('所有号码已抽完');
      return;
    }

    setIsDrawing(true);
    playRollMusic();

    const draw = () => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const selectedNumber = availableNumbers[randomIndex];
      displayNumberRef.current = selectedNumber; // 保存实际显示的数字
      setCurrentNumber(selectedNumber);
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
  };

  // 停止抽奖
  const stopDraw = () => {
    if (!isDrawing) return;

    // 先停止动画
    cancelAnimationFrame(animationRef.current);
    
    // 确保使用实际显示的数字
    const finalNumber = displayNumberRef.current;
    setCurrentNumber(finalNumber);
    setIsDrawing(false);
    
    playWinMusic();

    // 只在有确定的中奖号码时添加到记录
    if (finalNumber !== null) {
      setWinners(prev => [...prev, {
        prize: currentPrize,
        number: finalNumber,
        timestamp: Date.now()
      }]);
    }
  };

  const deleteWinner = (index) => {
    setWinners(prev => prev.filter((_, i) => i !== index));
  };

  const showNumberRangeModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (numberRange.start >= numberRange.end) {
      message.error('起始号码必须小于结束号码');
      return;
    }
    generateNumbers(numberRange.start, numberRange.end);
    setIsModalVisible(false);
  };

  const generateNumbers = (start, end) => {
    const numbers = Array.from(
      { length: end - start + 1 }, 
      (_, i) => start + i
    );
    setParticipants(numbers);
    message.success('号码生成成功');
  };

  return (
    <AppContainer>
      <SoundButton 
        onClick={toggleMute}
      >
        {isMuted ? (
          <MuteIcon>
            <SoundFilled className="sound-icon" />
          </MuteIcon>
        ) : (
          <SoundFilled />
        )}
      </SoundButton>
      <Header>
        <h2>抽奖系统</h2>
      </Header>
      
      <MainContent>
        <DrawBox>
          <PrizeBox>
            <DrawNumber 
              isDrawing={isDrawing}
              number={formatNumber(currentNumber)}
            >
              {formatNumber(currentNumber)}
            </DrawNumber>
          </PrizeBox>
          
          <BottomControls>
            <PrizeSelect
              value={currentPrize}
              onChange={value => setCurrentPrize(value)}
            >
              <Select.Option value="一等奖">一等奖</Select.Option>
              <Select.Option value="二等奖">二等奖</Select.Option>
              <Select.Option value="三等奖">三等奖</Select.Option>
            </PrizeSelect>
            
            <ParticipantCount>
              剩余号码: {participants.length - winners.length}
            </ParticipantCount>
            
            {!isDrawing ? (
              <StartButton
                type="primary"
                onClick={startDraw}
                disabled={participants.length === winners.length}
              >
                开始抽奖
              </StartButton>
            ) : (
              <StartButton
                type="primary"
                onClick={stopDraw}
              >
                停止
              </StartButton>
            )}
            
            {participants.length === 0 && (
              <Button onClick={showNumberRangeModal}>
                生成号码
              </Button>
            )}
          </BottomControls>
        </DrawBox>
        
        <WinnerList>
          <h3>中奖记录</h3>
          {winners.map((winner, index) => (
            <WinnerItem key={index}>
              <WinnerInfo>
                <div className="prize-name">{winner.prize}</div>
                <div className="number">中奖号码: {formatNumber(winner.number)}</div>
              </WinnerInfo>
              <CloseOutlined 
                className="delete-button"
                onClick={() => deleteWinner(index)}
              />
            </WinnerItem>
          ))}
        </WinnerList>
      </MainContent>

      <NumberRangeModal
        title="设置号码范围"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="range-inputs">
          <InputNumber
            min={1}
            value={numberRange.start}
            onChange={value => setNumberRange(prev => ({ ...prev, start: value }))}
            placeholder="起始号码"
          />
          <span>至</span>
          <InputNumber
            min={1}
            value={numberRange.end}
            onChange={value => setNumberRange(prev => ({ ...prev, end: value }))}
            placeholder="结束号码"
          />
        </div>
      </NumberRangeModal>
    </AppContainer>
  );
}

export default App; 