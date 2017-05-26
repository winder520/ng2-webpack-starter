// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
declare var kityminder: any;
interface Array<T> {
    /**
      * Sorts the elements of a sequence in ascending order according to a key.
      */
    orderBy(callBackFn?: (a: T) => any): this;
    /**
      * Sorts the elements of a sequence in descending order.
      */
    orderByDescending(callBackFn?: (a: T) => any): this;
    /**
      * Sorts the elements of a sequence in descending order.
      */
    thenBy(callBackFn?: (a: T) => any): this;
    /**
      * Sorts the elements of a sequence in descending order.
      */
    thenByDescending(callBackFn?: (a: T) => any): this;
    /**
      * Removes all the elements that match the conditions defined by the specified Predicate.
      */
    removeAll(callBackFn?: (a: T) => any): this;
    /**
      * Removes the first occurrence of a specific object from the Array.
      */
    remove(item: T): this;
    /**
      * Applies a specified function to the corresponding elements of two sequences, which produces a sequence of the results.
      */
    zip(items: T[], callBackFn?: (a: T, b: T) => any): this;
    /**
      * Returns distinct elements from a sequence by using the default equality comparer to compare values.
      */
    distinct(callBackFn?: (a: T, b: T) => any): this;
    /**
      * Returns the first element of a sequence.
      */
    first(callBackFn?: (a: T) => any): T;
    /**
      * Returns the last element of a sequence.
      */
    last(callBackFn?: (a: T) => any): T;
    /**
      * Produces the set union of two sequences by using the default equality comparer.
      */
    union(items: T[]): T;
    /**
      * Produces the set union of two sequences by using the default equality comparer.
      */
    intersect(items: T[]): T;
    /**
      * Produces the set union of two sequences by using the default equality comparer.
      */
    except(items: T[]): T;
    /**
      * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
      */
    skip(item: number): this;
    /**
      * Returns a specified number of contiguous elements from the start of a sequence.
      */
    take(item: number): this;
    /**
      * Projects each element of a sequence into a new form.
      */
    select(callBackFn: (a: T) => any): this;
    /**
      * Projects each element of a sequence to an array and flattens the resulting sequences into one sequence.
      */
    selectMany(defaultFn: (a: T) => any, secondFn?: (a: T) => any): this;
    /**
     * 
     */
    where(callBackFn?: (a: T) => any): this;

    contains(item:T):boolean;
}