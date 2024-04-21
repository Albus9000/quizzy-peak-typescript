

import QuizLoader from "../QuizLoader";
describe('QuizLoader loadQuestions()', () => {
    let loader: QuizLoader;
    let questions: Question[];
    beforeEach(async ()=>{
        loader = new QuizLoader();
        questions = await loader.loadQuestions();
    })
    it('loads questions correctly',  () => {
        expect(questions.length).toBeGreaterThan(0)
    });
    it('question answer should be part of the options', () => {
        questions.forEach((question) => {
            expect(question.options.includes(question.answer)).toBeTruthy()
        })
    });
    it('question id should be unique', () => {
        expect(Array.from(new Set(questions.map((question)=>question.id)))).toStrictEqual(questions)
    });
});