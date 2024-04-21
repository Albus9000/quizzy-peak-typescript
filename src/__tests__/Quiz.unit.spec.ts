import Leaderboard from "../Leaderboard";
import Quiz from "../Quiz";
import UserProfile, { AccountType } from "../UserProfile";

class MockUserProfile extends UserProfile {
  isAuthenticated: jest.Mock;

  constructor() {
    super('correct username', 'test', 'test', AccountType.User, 'test', 'test');
    this.isAuthenticated = jest.fn();
  }
}

describe('Quiz', () => {
  let quiz: Quiz;
  let mockUserProfile: MockUserProfile;

  beforeEach(() => {
    quiz = new Quiz()
    mockUserProfile = new MockUserProfile();
    jest.spyOn(mockUserProfile, 'isAuthenticated');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('setCurrentUser()', () => {
    it('should set the current user when the userProfile is authenticated', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      expect(() => quiz.setCurrentUser(mockUserProfile)).not.toThrow();
    });

    it('should throw an error when not authenticated', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(false);
      expect(() => quiz.setCurrentUser(mockUserProfile)).toThrow('User must be authenticated to start a quiz.');
    });
  })
  describe('addQuestion()', () => {
    it("should throw an error when currentUser is undefined", () => {
      expect(() =>
        quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "" })
      ).toThrow('Only admin users can add questions.');
    });
    it("should throw an error when currentUser is not an admin", () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      quiz.setCurrentUser(mockUserProfile);
      expect(() =>
        quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "" })
      ).toThrow('Only admin users can add questions.');
    });
    it('should add the question when currentUser is an admin and the number of questions is below the threshold', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(() =>
        quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "" })
      ).not.toThrow('Only admin users can add questions.');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
    it('should warn when currentUser is an admin and the number of questions is above the threshold', () => {
      quiz = new Quiz(0);
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(() =>
        quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "" })
      ).not.toThrow('Only admin users can add questions.');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  })
  describe('searchQuestions()', () => {
    it('should return all questions when the keyword is empty', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "sgrawrg aregae", options: [], answer: "", category: "awgegerg aerghrtj" });
      quiz.addQuestion({ id: 43, text: "sgraaerhgwrg aregxfhjae", options: [], answer: "", category: "awgetrehyhgerg aewethrghrtj" });
      quiz.addQuestion({ id: 44, text: "sgrawrethweg aregnyae", options: [], answer: "", category: "awgegewtherg aerghrtj" });
      expect(quiz.searchQuestions('')).toHaveLength(3);
    });
    it('should return all questions that contain the keyword inside their text or category', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "sgrawrg aregae", options: [], answer: "", category: "awgegerg aerghrtj" });
      quiz.addQuestion({ id: 43, text: "sgraaerhgwrg 123 aregxfhjae", options: [], answer: "", category: "awgetrehyhgerg aewethrghrtj" });
      quiz.addQuestion({ id: 44, text: "sgrawrethweg aregnyae", options: [], answer: "", category: "awgegewtherg aerghrtj" });
      quiz.addQuestion({ id: 45, text: "sgrawehweg arenae", options: [], answer: "", category: "awgegewtherg 123 aerghrtj" });
      expect(quiz.searchQuestions('123')).toHaveLength(2);
    });
  })
  describe('editQuestion()', () => {
    it('should throw an error when currentUser is undefined', () => {
      expect(() =>
        quiz.editQuestion(42, { text: "new text" })
      ).toThrow('Only admin users can add questions.');
    });
    it("should throw an error when currentUser is not an admin", () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      quiz.setCurrentUser(mockUserProfile);
      expect(() =>
        quiz.editQuestion(42, { text: "new text" })
      ).toThrow('Only admin users can add questions.');
    });
    it('should be able to edit all properties of a question', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "" });
      const updatedQuestion = { id: 43, text: "new text", options: ["new option"], answer: "new answer", category: "new category" };
      quiz.editQuestion(42, updatedQuestion);
      expect(quiz.searchQuestions('')[0]).toEqual(updatedQuestion);
    });
  })
  describe('removeQuestion()', () => {
    it('should throw an error when currentUser is undefined', () => {
      expect(() =>
        quiz.removeQuestion(42)
      ).toThrow('Only admin users can add questions.');
    });
    it("should throw an error when currentUser is not an admin", () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      quiz.setCurrentUser(mockUserProfile);
      expect(() => quiz.removeQuestion(42)).toThrow('Only admin users can add questions.');
    });
    it('should remove a question by id', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "" });
      quiz.removeQuestion(42);
      expect(quiz.searchQuestions('')).toHaveLength(0);
    });
  })
  describe('startQuiz()', () => {
    it('should throw an error when the user is not authenticated', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      quiz.setCurrentUser(mockUserProfile);
      mockUserProfile.isAuthenticated.mockReturnValue(false);
      expect(() =>
        quiz.startQuiz({ numberQuestions: 42, category: "", username: "correct username" })
      ).toThrow('Invalid or unauthenticated user.');
    });
    it('should throw an error when the user is undefined', () => {
      expect(() =>
        quiz.startQuiz({ numberQuestions: 42, category: "", username: "correct username" })
      ).toThrow('Invalid or unauthenticated user.');
    });
    it('should only return questions from the specified category', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "category 1" });
      quiz.addQuestion({ id: 43, text: "", options: [], answer: "", category: "category 1" });
      quiz.addQuestion({ id: 44, text: "", options: [], answer: "", category: "category 2" });
      expect(quiz.startQuiz({ numberQuestions: 3, category: "category 1", username: "correct username" })).toHaveLength(2);
    });
    it('should only return the correct number of questions', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "category" });
      quiz.addQuestion({ id: 43, text: "", options: [], answer: "", category: "category" });
      quiz.addQuestion({ id: 44, text: "", options: [], answer: "", category: "category" });
      expect(quiz.startQuiz({ numberQuestions: 2, category: "category", username: "correct username" })).toHaveLength(2);
    });

    //SHOULD PASS
    it('should throw an error when the username does not match the current user', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      quiz.setCurrentUser(mockUserProfile);
      expect(() =>
        quiz.startQuiz({ numberQuestions: 42, category: "", username: "wrong username" })
      ).toThrow('Invalid or unauthenticated user.')
      expect(() =>
        quiz.startQuiz({ numberQuestions: 42, category: "", username: "correct username" })
      ).not.toThrow('Invalid or unauthenticated user.')
    })

  })
  describe('finishQuiz()', () => {
    it('should throw an error when the user is undefined', () => {
      expect(() =>
        quiz.finishQuiz(new Leaderboard())
      ).toThrow('User not set.');
    });

    //SHOULD PASS
    it('should throw an error if the quiz has no questions', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      quiz.setCurrentUser(mockUserProfile);
      expect(() =>
        quiz.finishQuiz(new Leaderboard())
      ).toThrow('No quiz questions.');
    });
    it('should register result of the quiz in the leaderboard', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "", category: "category" });
      const leaderboard = new Leaderboard();
      quiz.finishQuiz(leaderboard);
      expect(leaderboard.getUserScores('correct username')).toHaveLength(1);
    })
    //TODO CONTINUE HERE
  })
  describe('submitAnswer()', () => {
    it('should increment the current score when the answer is correct', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "correct answer", category: "category" });
      const leaderboard = new Leaderboard();
      quiz.finishQuiz(leaderboard);
      let userScores: LeaderboardEntry[] = leaderboard.getUserScores('correct username')
      expect(userScores).toHaveLength(1);
      expect(userScores[0].category).toBe('category')
      expect(userScores[0].score).toBe(0)
      quiz.submitAnswer(42, "correct answer");
      quiz.finishQuiz(leaderboard);
      userScores = leaderboard.getUserScores('correct username')
      expect(userScores).toHaveLength(1);
      expect(userScores[0].category).toBe('category')
      expect(userScores[0].score).toBe(1)
    });
    it('should not increment the current score when the answer is incorrect', () => {
      mockUserProfile.isAuthenticated.mockReturnValue(true);
      mockUserProfile.accountType = AccountType.Admin;
      quiz.setCurrentUser(mockUserProfile);
      quiz.addQuestion({ id: 42, text: "", options: [], answer: "correct answer", category: "category" });
      const leaderboard = new Leaderboard();
      quiz.finishQuiz(leaderboard);
      let userScores: LeaderboardEntry[] = leaderboard.getUserScores('correct username')
      expect(userScores).toHaveLength(1);
      expect(userScores[0].category).toBe('category')
      expect(userScores[0].score).toBe(0)
      quiz.submitAnswer(42, "incorrect answer");
      quiz.finishQuiz(leaderboard);
      userScores = leaderboard.getUserScores('correct username')
      expect(userScores).toHaveLength(1);
      expect(userScores[0].category).toBe('category')
      expect(userScores[0].score).toBe(0)
    });
  })

})