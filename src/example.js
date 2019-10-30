//example of Javascpript constructor
function User(firstName, lastName, age, gender) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
}

//creating an object
var user1 = new User('John', 'Spencer', 28, 'male');

user1.prototype.emailDomain = '@facebook.com';

console.log(user1.emailDomain);
