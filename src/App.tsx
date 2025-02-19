import Trivia from "./components/Trivia";
import Settings from  "./components/Settings"
import styled from "styled-components";
import {useEffect, useState} from "react";
import './App.css'
import {Questions} from "./interfaces/Questions"
import he from "he"; /* had to use this because the text contained things like
&quot;, &ampl, etc., so I had to decode the html encoded entities to normal text
*/

const ParentDiv=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 100vw;
  gap: 24px;
  padding-bottom: 24px;
`;

const EndButtons=styled.button`
    transition: all 0.3s ease-in-out;

    &:hover {
        color: #27242e;
        background-color: white;  
        transform: scale(1.05);  
    }
`;

export default function App(){
    // useState Hook to store Data.
    const [numQuestions, setNumQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState<"any" | "easy" | "medium" | "hard">("any"); 
    const [data, setData] = useState<Questions[]>([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [seeResults, setSeeResults] = useState(false);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

    // useEffect Hook for error handling and re-rendering.
    useEffect(() => {
        if (!quizStarted) return;

        async function fetchData(): Promise<void> {
            const rawData = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}${
              difficulty !== "any" ? `&difficulty=${difficulty}` : ""
            }`);

            const jsonResponse = await rawData.json();
            console.log("API Response:", jsonResponse);

            const { results }: { results: Omit<Questions, "id">[] } = jsonResponse;

            const formattedData: Questions[] = results.map((q, index) => ({
              id: index + 1, // assign id since raw data doesn't have id field
              category: he.decode(q.category),
              difficulty: q.difficulty,
              question: he.decode(q.question),
              correct_answer: he.decode(q.correct_answer),
              incorrect_answers: q.incorrect_answers.map(ans => he.decode(ans)),
            }));

            setData(formattedData);
        }
        fetchData()
            .then(() => console.log("Data fetched successfully"))
            .catch((e: Error) => console.log("There was the error: " + e));
    }, [quizStarted]);

    const calculateScore = () => {
      let newScore = 0;
      data.forEach((question) => {
          if (userAnswers[question.id] === question.correct_answer) {
              newScore++;
          }
      });
      setScore(newScore);
      setSeeResults(true);
  };

    return(
        <ParentDiv>
            <h1>Trivia Game</h1>
            {!quizStarted ? (
              <Settings 
                numQuestions={numQuestions}
                difficulty={difficulty}
                setNumQuestions={setNumQuestions} 
                setDifficulty={setDifficulty} 
                startQuiz={() => {
                  setScore(0);
                  setQuizStarted(true);
                }}
              />
            ) : (
              <>
                <Trivia data={data} seeResults={seeResults} setUserAnswers={setUserAnswers}/>
                {!seeResults ? (
                        <EndButtons onClick={calculateScore}>See Results</EndButtons>
                    ) : (
                        <strong>Score: {score} / {data.length}</strong>
                    )}
                <EndButtons onClick={() => {
                    setQuizStarted(false);
                    setSeeResults(false);
                  }}>Restart Quiz</EndButtons>
              </>
            )}
        </ParentDiv>
    )
}
