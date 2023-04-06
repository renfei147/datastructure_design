import { Schedule, User } from "../../common/definitions";

export default {
    currentUser: null as User | null,
    async getUsers$(): Promise<User[]> {
        return fetch('/api/users').then(res => res.json());
    },
    getUserId() {
        if (this.currentUser === null) throw new Error("Not login");
        return this.currentUser.id;
    },
    async getSchedule$(): Promise<Schedule> {
        return fetch(`/api/schedule?id=${this.getUserId()}`).then(res => res.json());
    }
}
