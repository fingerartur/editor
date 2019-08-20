export class Sets {
    
    static equal<T>(a: Set<T>, b: Set<T>): boolean {
        if (a.size !== b.size) {
            return false;
        }
        let result = true;
        a.forEach(element => {
            if (!b.has(element)) {
                result = false;
            }
        });
        return result;
    }

    static difference<T>(a: Set<T>, b: Set<T>): Set<T> {
        const result = new Set<T>();
        a.forEach(element => {
            if (!b.has(element)) {
                result.add(element);
            }
        });
        return result;
    }

    static union<T> (a: Set<T>, b: Set<T>): Set<T> {
        const result = new Set<T>();
        a.forEach(element => { result.add(element); });
        b.forEach(element => { result.add(element); });
        return result;
    }
}