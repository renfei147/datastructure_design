import { Schedule, User,ShortestPath } from "../../common/definitions";

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
    },
    async getShortestPath$(start: number, end: number): Promise<ShortestPath> {
        return fetch(`/api/shortestPath?start=${start}&end=${end}`).then(res => res.json());
    }
}
