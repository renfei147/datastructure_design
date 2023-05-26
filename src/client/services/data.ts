import { Schedule, User, ShortestPath, Activity, Tempwork, Course } from "../../common/definitions";

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
    async addCourse(course: Course & { students: User[] }) {
        await fetch('/api/addcourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "add",
                msg: course
            })
        })
    },
    async updateCourse(course: Course & { students: User[] }) {
        await fetch('/api/updcourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "upd",
                msg: course
            })
        })
    },
    async delCourse(id: string) {
        await fetch('/api/delcourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "del",
                msg: id
            })
        })
    },
    async addActivity(activity: Activity & { students: User[] }) {
        await fetch('/api/addactivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "add",
                msg: activity
            })
        })
    },
    async updateActivity(activity: Activity & { students: User[] }) {
        await fetch('/api/updactivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "upd",
                msg: activity
            })
        })
    },
    async delActivity(id: string) {
        await fetch('/api/delactivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "del",
                msg: id
            })
        })
    },
    async addTempwork(tempwork: Tempwork & { students: User[] }) {
        await fetch('/api/addtempwork', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "add",
                msg: tempwork
            })
        })
    },
    async updateTempwork(tempwork: Tempwork & { students: User[] }) {
        await fetch('/api/updtempwork', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "upd",
                msg: tempwork
            })
        })
    },
    async delTempwork(id: string) {
        await fetch('/api/deltempwork', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: "del",
                msg: id
            })
        })
    },
}
