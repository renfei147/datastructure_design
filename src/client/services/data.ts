import { Schedule, User, ShortestPath, Activity, Tempwork, Course } from "../../common/definitions";

type DataType = 'course' | 'activity' | 'tempwork';
type DataContent = (Course | Activity | Tempwork) & { students: User[] };
export default {
    currentUser: null as User | null,

    async getUsers(): Promise<User[]> {
        return fetch('/api/users').then(res => res.json());
    },
    getUserId() {
        if (this.currentUser === null) throw new Error("Not login");
        return this.currentUser.id;
    },
    async getSchedule(): Promise<Schedule> {
        return fetch(`/api/schedule?id=${this.getUserId()}`).then(res => res.json());
    },

    async getShortestPath(start: number, end: number): Promise<ShortestPath> {
        return fetch(`/api/shortestPath?start=${start}&end=${end}`).then(res => res.json());
    },

    async getTSP(locations: number[]): Promise<ShortestPath> {
        return fetch('/api/tsp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idlist: locations })
        }).then(res => res.json());
    },

    async add(type: DataType, content: DataContent) {
        const res = await fetch('/api/add' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: 'add',
                msg: content
            })
        })
        const data = await res.text();
        if (data == 'success') return true;
        return JSON.parse(data) as DataContent[];
    },
    async update(type: DataType, content: DataContent) {
        const res = await fetch('/api/upd' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: 'upd',
                msg: content
            })
        })
        const data = await res.text();
        if (data == 'success') return true;
        return JSON.parse(data) as DataContent[];
    },
    async del(type: DataType, id: string) {
        await fetch('/api/del' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: 'del',
                msg: id
            })
        })
    },

    async getLog(): Promise<any> {
        return fetch('/api/log').then(res => res.json());
    },
}
