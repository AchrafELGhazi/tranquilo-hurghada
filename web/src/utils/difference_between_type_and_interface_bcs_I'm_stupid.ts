// Interface - can be extended and reopened
interface User {
    name: string;
}

interface User {  // Declaration merging - adds to existing interface
    age: number;
}

interface Admin extends User {  // Extension
    permissions: string[];
}

// Type - cannot be reopened, but can be extended with intersection
// type User = {
//     name: string;
// }

// type User = { age: number; }  // ❌ Error: Duplicate identifier

// type Admin = User & {  // Intersection
//     permissions: string[];
// }

/*
What They Can Represent
*/

// Interface - only objects
interface UserInterface {
    name: string;
    age: number;
}

// Type - objects, primitives, unions, functions, etc.
type UserType = {
    name: string;
    age: number;
}

type StringOrNumber = string | number;  // ✅ Union
type UserRole = 'admin' | 'user';      // ✅ String literal union
type Handler = (data: string) => void;  // ✅ Function type
type UserId = string;                   // ✅ Alias






/*
Computed Properties
*/

// Type - supports computed properties
type Keys = 'name' | 'age';
type UserRecord = {
    [K in Keys]: string;  // ✅ Mapped type
}

// Interface - doesn't support mapped types directly
interface UserInterface {
    // [K in Keys]: string;  // ❌ Not allowed
}