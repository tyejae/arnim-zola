class SecurityUtil {
    static NOT_OFFICER_MSG() { return 'You must be an officer to run this command.' }
    static isOfficer(member) {
        if (!member || !member.roles) {
            return false;
        }
        let isOfficer = false;
        if(member.roles.some(r=>["H1-Officers", "H2-Officers"].includes(r.name)) ) {
            // has one of the roles
            isOfficer = true;
        }
        
        return isOfficer
    }
}
module.exports = SecurityUtil;