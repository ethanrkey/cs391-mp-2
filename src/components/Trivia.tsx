/*
- choose # of questions (10-50, increments of 10), choose difficulty
- display question
- answer choices below
- red or green based on correct/incorrect
- keep score & display at the end
*/

import { useState, useEffect } from "react";
import styled from "styled-components";
import {Questions} from "../interfaces/Questions"

const AllQsDiv=styled.div`
    display: flex;
    flex-flow: row wrap;    
    justify-content: space-evenly;
    background-color: white;
`;

const SingleQsDiv=styled.div`
    display: flex;
    flex-direction: column;   
    justify-content: center;
    width: 75%;
    padding: 2%;
    margin: 1%;
    background-color: grey;
    color: black;
    border: 3px #401a18 solid;
    text-align: center;
`;

const AnswerChoiceButton=styled.button`
    background-color: #ede1be;
    color: black;
    max-width: 25%;
`;

const AnswersDiv=styled.div`
    display: flex;
    flex: direction: row;
    justify-content: center;
    gap: 8px;
    padding-top: 8px;
`;

export default function Trivia(props : { data:Questions[], seeResults: boolean, setUserAnswers: (answers: Record<number, string>) => void } ){
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [shuffledAnswers, setShuffledAnswers] = useState<Record<number, string[]>>({});

    useEffect(() => {
        const newShuffledAnswers: Record<number, string[]> = {};
        props.data.forEach(Q => {
            newShuffledAnswers[Q.id] = [...Q.incorrect_answers, Q.correct_answer].sort(() => Math.random() - 0.5);
        });
        setShuffledAnswers(newShuffledAnswers);
    }, [props.data]);

    const handleAnswerClick = (questionId: number, answer: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    useEffect(() => {
        props.setUserAnswers(selectedAnswers);
    }, [selectedAnswers, props.setUserAnswers]);

    return (
        <AllQsDiv>
            {props.data.map((Q: Questions) => (
                <SingleQsDiv key={Q.id}>
                    <h3>Question #{Q.id}: {Q.question}</h3>
                    <div>
                        <p>Category: {Q.category}</p>
                        <p>Difficulty: {Q.difficulty}</p>
                    </div>
                    <AnswersDiv>
                        {shuffledAnswers[Q.id]?.map((answer, index) => (
                            <AnswerChoiceButton
                                key={index}
                                onClick={() => handleAnswerClick(Q.id, answer)}
                                style={{
                                    backgroundColor: props.seeResults
                                        ? answer === Q.correct_answer
                                            ? "#60f05d"
                                            : selectedAnswers[Q.id] === answer
                                                ? "#e33d2d"
                                                : "grey"
                                        : selectedAnswers[Q.id] === answer
                                            ? "#87c0d4"
                                            : "#ede1be"
                                }}
                            >
                                {answer}
                            </AnswerChoiceButton>
                        ))}
                    </AnswersDiv>
                </SingleQsDiv>
            ))}
        </AllQsDiv>
    );
}
