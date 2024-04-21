import Leaderboard from "../Leaderboard";
describe('Leaderboard', () => {
    let leaderboard: Leaderboard;
    beforeEach(()=>{
        leaderboard = new Leaderboard();
    })
    describe('addScore()', ()=>{
        it('should add a score', ()=>{
            expect(leaderboard.addScore('new category', 'new user', 42)).toBeUndefined()
            expect(leaderboard.getTopScoresForCategory('new category', 1)).toHaveLength(1)
            expect(leaderboard.getUserScores('new user')).toHaveLength(1)
            expect(leaderboard.getUserScores('new user')[0].score).toBe(42)
        })
        it('should update a user score for a given category if its higher ', ()=>{
            leaderboard.addScore('some category', 'some user', 42)
            expect(leaderboard.getUserScores('some user')).toHaveLength(1)
            expect(leaderboard.getUserScores('some user')[0].score).toBe(42)
            leaderboard.addScore('some category', 'some user', 47)
            expect(leaderboard.getUserScores('some user')).toHaveLength(1)
            expect(leaderboard.getUserScores('some user')[0].score).toBe(47)
        })
        it('should not update a user score for a given category if it is lower ', ()=>{
            leaderboard.addScore('some category', 'some user', 42)
            expect(leaderboard.getUserScores('some user')).toHaveLength(1)
            expect(leaderboard.getUserScores('some user')[0].score).toBe(42)
            leaderboard.addScore('some category', 'some user', 40)
            expect(leaderboard.getUserScores('some user')).toHaveLength(1)
            expect(leaderboard.getUserScores('some user')[0].score).toBe(42)
        })
    })
    describe('getTopScoresForCategory()', () => {
        it('should retrieves the top scores for a given category', () => {
            leaderboard.addScore("some category", "some user", 42)
            expect(leaderboard.getTopScoresForCategory('some category', 1)).toHaveLength(1)
        });

        it('should return an empty array if the category is undefined', () => {
            expect(leaderboard.getTopScoresForCategory("undefined category", 1)).toHaveLength(0)
        });
        it('should return an empty array if the number of entries is negative', () => {
            leaderboard.addScore("some category", "some user", 42)
            expect(leaderboard.getTopScoresForCategory("some category", -1)).toHaveLength(0)
            expect(leaderboard.getTopScoresForCategory("some category", -2)).toHaveLength(0)
        });
        it('should return entries from empty string category', () => {
            leaderboard.addScore("", 'some user', 42)
            expect(leaderboard.getTopScoresForCategory("", 1)).toHaveLength(1)
        });
    })
    describe('getUserScores()', ()=>{
        it('should return an empty array if the user dont exists', () => {
            expect(leaderboard.getUserScores('user without score')).toHaveLength(0)
        });
        it('should scores from all categories', () => {
            leaderboard.addScore('some category 1', 'some user', 42)
            leaderboard.addScore('some category 2', 'some user', 42)
            leaderboard.addScore('some category 3', 'some user', 42)
            expect(leaderboard.getUserScores('some user')).toHaveLength(3)
        });
        it('should only return scores from the specified user', () => {
            leaderboard.addScore('some category', 'some user 1', 42)
            leaderboard.addScore('some category', 'some user 2', 42)
            expect(leaderboard.getUserScores('some user 1')).toHaveLength(1)
        });
        it('should sort scores from higher to lower', () => {
            leaderboard.addScore('some category 1', 'some user', -3)
            leaderboard.addScore('some category 2', 'some user', 0)
            leaderboard.addScore('some category 3', 'some user', 1)
            leaderboard.addScore('some category 4', 'some user', 2)
            leaderboard.addScore('some category 5', 'some user', 3)
            expect(leaderboard.getUserScores('some user')[0].score).toBe(3)
            expect(leaderboard.getUserScores('some user')[1].score).toBe(2)
            expect(leaderboard.getUserScores('some user')[2].score).toBe(1)
            expect(leaderboard.getUserScores('some user')[3].score).toBe(0)
            expect(leaderboard.getUserScores('some user')[4].score).toBe(-3)
        });
    })
    describe('getEntryString()', () => {
        it('should return a string representing a leaderboardEntry', () => {
            const entry: LeaderboardEntry = {
                username: "some user",
                score: 42,
                category: "some category"
            }
           expect(leaderboard.getEntryString(entry)).toBe("some user has a score of 42 in category 'some category'.")  
        });
        it('empty string category', () => {
            const entry: LeaderboardEntry = {
                username: "some user",
                score: 0,
                category: ""
            }
            //NOT SURE WHICH SHOULD PASS
           expect(leaderboard.getEntryString(entry)).toBe("some user has a score of 0 in category ''.")     
           expect(leaderboard.getEntryString(entry)).toBe("some user has a score of 0.")     
        })
        it('should not mention undefined category', () => {
            const entry: LeaderboardEntry = {
                username: "some user",
                score: 0,
                category: undefined
            }
           expect(leaderboard.getEntryString(entry)).toBe("some user has a score of 0.")  
        });
    })
})