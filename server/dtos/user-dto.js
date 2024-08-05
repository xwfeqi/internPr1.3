module.exports = class UserDto {
    email;
    id;
    isActivated;
    name;
    role;
    registeredDate;
    studyDate; 
    activationLink; 

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.name = model.name;
        this.role = model.role;
        this.registeredDate = model.registeredDate;
        this.studyDate = model.studyDate;
        this.activationLink = model.activationLink;
    }
}
