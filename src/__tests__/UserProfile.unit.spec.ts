import UserProfile from '../UserProfile';


describe('UserProfile', () => {
	let userProfile: UserProfile;
	beforeEach(()=>{
		userProfile = new UserProfile('username', 'email', 'password', 0, 'firstname', 'lastname');
	});			
	
	describe('authenticate()', () => {
		it('authenticate() with wrong email and wrong password return false', () => {
			expect(userProfile.authenticate('wrong email', 'wrong password')).toBeFalsy();
		});
		
		it('authenticate() with wrong email and good password return false', () => {
			expect(userProfile.authenticate('wrong email', 'password')).toBeFalsy();
		});
		
		it('authenticate() with good email and wrong password return false', () => {
			expect(userProfile.authenticate('email', 'wrong password')).toBeFalsy();
		});
		
		it('authenticate() with wrong good and good password should return true', () => {
			expect(userProfile.authenticate('email', 'password')).toBeTruthy();
		});
	});

	describe('isAuthenticated()', () => {	
		it('isAuthenticated() with a new user should return false', () => {
			expect(userProfile.isAuthenticated()).toBeFalsy();
		});
		it('isAuthenticated() with a authenticated user should return true', () => {
			userProfile.authenticate('email', 'password');
			expect(userProfile.isAuthenticated()).toBeTruthy();
		});
	});

	it('should not be able to change to an invalid name (with less than 1 character)', () => {
		expect(() => {
			userProfile.firstName = '';
		}).toThrow();
		expect(() => {
			userProfile.lastName = '';
		}).toThrow();
	});

	it('should not be able to change to an invalid name (with more than 50 character)', () => {
		expect(() => {
			userProfile.firstName = '123456789012345678901234567890123456789012345678901234567890';
		}).toThrow();
		expect(() => {
			userProfile.lastName = '123456789012345678901234567890123456789012345678901234567890';
		}).toThrow();
	});
})