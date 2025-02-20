import styled from "styled-components";
import { useState, useEffect } from "react";
import '../App.css'

const SettingsParentDiv=styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-top: white solid 2px;
    border-bottom: white solid 2px;
    padding-bottom: 20px
`;

const SettingsDiv=styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px;
`;

const StartButton=styled.button`
    transition: all 0.3s ease-in-out;

    &:hover {
        color: #27242e;
        background-color: white;  
        transform: scale(1.05);  
    }
`;

const NumberInput = styled.input`
    border-radius: 10px;
    font-size: 3vw;
    scale: .7;
`;

type SettingsProps = {
    numQuestions: number;
    difficulty: "easy" | "medium" | "hard" | "any";
    setNumQuestions: (value: number) => void;
    setDifficulty: (value: "easy" | "medium" | "hard" | "any") => void;
    startQuiz: () => void; 
};

export default function Settings({ numQuestions, difficulty, setNumQuestions, setDifficulty, startQuiz }: SettingsProps) {
    const [localNumQuestions, setLocalNumQuestions] = useState(10);
    const [localDifficulty, setLocalDifficulty] = useState("any");

    useEffect(() => {
        setLocalNumQuestions(numQuestions);
        setLocalDifficulty(difficulty);
    }, [numQuestions, difficulty]);

    return(
        <SettingsParentDiv>
            <h3>Please choose from the following settings for the trivia questions you&apos;d like to answer!</h3>
            <SettingsDiv>
                <p>How many questions? (Max: 50)</p>
                <NumberInput type="number" placeholder="Number of questions" 
                    value={localNumQuestions} onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    setLocalNumQuestions(value);
                                                    setNumQuestions(value);
                                                }} />
            </SettingsDiv>
            <SettingsDiv>
                <p>What difficulty?</p>
                <select value={localDifficulty} onChange={(e) => {
                                                    const value = e.target.value as "easy" | "medium" | "hard" | "any";
                                                    setLocalDifficulty(value);
                                                    setDifficulty(value);
                                                }}>
                    <option value="any">Any</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </SettingsDiv>

            <StartButton onClick={startQuiz}>Start Quiz</StartButton>
        </SettingsParentDiv>
    )
}