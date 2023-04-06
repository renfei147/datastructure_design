class HashTable<T = any>{
    private hashLength: number = 31;
    private hashNum: number = 0;// 表示存储元素数
    private indexStorage: [string, T][][] = [];//  用于存储数据，本哈希表采用链地址法解决地址冲突

    private getHash(id: string, Mod: number): number {
        const bas = 61;
        const lenth = id.length;
        let hashCode = 0;
        for (let i = 0; i < length; i++) {
            hashCode = hashCode * bas + id.charCodeAt(i);
        }
        return hashCode % Mod;
    }
    private capacityChange(newLength: number) { //扩容、缩容方法
        const oldData = this.indexStorage;
        this.indexStorage = [];
        this.hashNum = 0;
        this.hashLength = newLength;
        oldData.forEach((e) => {
            if (!e) return;
            for (let i = 0; i < e.length; i++) {
                const oldElement = e[i];
                this.put(oldElement[0], oldElement[1]);
            }
        });
    }

    public put(key: string, value: T) {// 修改、添加元素值（如果元素存在就修改，不存在就添加）
        const index = this.getHash(key, this.hashLength);
        let elementList = this.indexStorage[index];

        // 没有元素则添加一个
        if (!elementList) {
            elementList = [];
            this.indexStorage[index] = elementList;
        }

        // 有元素则进行查找
        let elementExist = false;
        for (let i = 0; i < elementList.length; i++) {
            let targetElement = elementList[i];
            const targetKey = targetElement[0];
            if (targetKey === key) {
                // 修改/更新的操作
                targetElement[1] = value;
                elementExist = true;
                break;
            }
        }
        // 装填因子大于0.75时进行扩容
        const loadFactor = this.hashNum / this.hashLength;
        if (loadFactor < 0.75) {
            this.capacityChange(this.hashLength * 2);
        }

        if (!elementExist) {
            //不存在元素就添加
            elementList.push([key, value]);
            this.hashNum++;
        }
    }

    public delete(key: string): boolean {// 删除元素，若元素之前不存在，返回false
        const index = this.getHash(key, this.hashLength);
        let elementList = this.indexStorage[index];

        // 没有元素则返回
        if (!elementList) {
            return false;
        }

        // 有元素则进行查找
        let elementExist = false;
        for (let i = 0; i < elementList.length; i++) {
            let targetElement = elementList[i];
            const targetKey = targetElement[0];
            if (targetKey === key) {
                // 删除该元素
                elementList.splice(i, 1);
                this.hashNum--;
                elementExist = true;
                break;
            }
        }
        // 装填因子小于0.1时进行缩容 （最小为默认大小）
        const loadFactor = this.hashNum / this.hashLength;
        if (loadFactor < 0.1 && this.hashLength > 32) {
            this.capacityChange(this.hashLength / 2);
        }

        if (!elementExist) {
            return false;
        }
        else {
            return true;
        }
    }
    public find(key: string): T | undefined { //查找表内元素，若不存在返回undefined
        const index = this.getHash(key, this.hashLength);
        let elementList = this.indexStorage[index];

        // 没有元素则返回未定义
        if (!elementList) {
            return undefined;
        }

        // 若存在元素，则进行查找
        for (let i = 0; i < elementList.length; i++) {
            let targetElement = elementList[i];
            const targetKey = targetElement[0];
            if (targetKey === key) {
                return targetElement[1];
            }
        }
        //找不到返回未定义
        return undefined;
    }


}