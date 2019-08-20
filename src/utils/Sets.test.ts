import { Sets } from './Sets';

describe('Sets', () => {
    beforeEach(() => {});

    it('checks sets for equality', () => {
        const a = new Set<number>();
        a.add(1);
        const b = new Set<number>();
        b.add(1);
        b.add(2);
        const c = new Set<number>();
        c.add(1);
        expect(Sets.equal(a,b)).toBeFalsy();
        expect(Sets.equal(a,c)).toBeTruthy();
        expect(Sets.equal(a,a)).toBeTruthy();
    });

    it('can do set union', () => {
        const a = new Set<number>();
        a.add(1);
        a.add(3);
        const b = new Set<number>();
        b.add(1);
        b.add(2);
        const result = Sets.union(a,b);
        expect(result.has(1)).toBeTruthy();
        expect(result.has(2)).toBeTruthy();
        expect(result.has(3)).toBeTruthy();
        expect(result.size).toBe(3);
    });

    it('can do set difference', () => {
        const a = new Set<number>();
        a.add(1);
        const b = new Set<number>();
        b.add(1);
        b.add(2);
        const result = Sets.difference(b,a);
        expect(result.has(2)).toBeTruthy();
        expect(result.size).toBe(1);
    });
});