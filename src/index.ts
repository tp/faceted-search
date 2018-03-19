enum StarRating {
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE
}

type NominalType<T, S extends string> = T & { __typeTag: S };

type UserRating = NominalType<string, "UserRating">;
type DistanceFromCityCenter = NominalType<number, "DistanceFromCityCenter">;
type EURAmount = NominalType<number, "EURAmount">;

function numberToUserRating(value: number): UserRating {
    if (value < 0 || value > 10) {
        throw new Error(`Invalid UserRating value`);
    }

    return value as any as UserRating;
}

function numberToDistanceFromCityCenter(value: number): DistanceFromCityCenter {
    if (value < 0) {
        throw new Error(`Invalid DistanceFromCityCenter value`);
    }

    return value as any as DistanceFromCityCenter;
}

function numberToEURAmount(value: number): EURAmount {
    if (value < 0) {
        throw new Error(`Invalid EURAmount value`);
    }

    return value as any as EURAmount;
}

interface Hotel {
    readonly name: string;
    readonly starRating: StarRating;
    readonly userRating: UserRating;
    readonly distanceFromCityCenter: DistanceFromCityCenter;
    readonly pricePerRoom: EURAmount;
    readonly reception247: boolean;
}

const hotels: Hotel[] = [
    {
        name: "Hostel 1",
        starRating: StarRating.ONE,
        userRating: numberToUserRating(6.9),
        distanceFromCityCenter: numberToDistanceFromCityCenter(4.0),
        pricePerRoom: numberToEURAmount(20),
        reception247: true,
    },
    {
        name: "Test 1",
        starRating: StarRating.THREE,
        userRating: numberToUserRating(7.9),
        distanceFromCityCenter: numberToDistanceFromCityCenter(1.8),
        pricePerRoom: numberToEURAmount(90),
        reception247: false,
    },
    {
        name: "Test 5🌟",
        starRating: StarRating.FIVE,
        userRating: numberToUserRating(9.8),
        distanceFromCityCenter: numberToDistanceFromCityCenter(0.7),
        pricePerRoom: numberToEURAmount(260),
        reception247: true,
    }
];

type DiscreteValueFilter<T extends object, K extends keyof T, V extends T[K]> = (object: T, fieldName: K, fieldValue: V) => boolean;
type RangeValueFilter<T extends object, K extends keyof T, V extends T[K] & number> = (object: T, fieldName: K, minValue: V, maxValue: V) => boolean;

function discreteValueFilter<T extends object, K extends keyof T, V extends T[K]>(object: T, fieldName: K, fieldValue: V) {
    return object[fieldName] === fieldValue;
}

function rangeValueFilter<T extends object, K extends keyof T, V extends T[K] & number> (object: T, fieldName: K, minValue: V, maxValue: V) {
    return object[fieldName] >= minValue && object[fieldName] <= maxValue;
}

function createSomeDistinctValueFilter<T extends object, K extends keyof T, V extends T[K]>(fieldName: K): (values: V[]) => (object: T) => boolean {
    return (values) => {
        return (object) => {
            return values.length === 0 || values.some(value => value === object[fieldName]);
        }
    }
}

function createRangeValueFilter<T extends object, K extends keyof T, V extends T[K] & number>(fieldName: K): (minValue: V, maxValue: V) => (object: T) => boolean {
    return (minValue, maxValue) => {
        return (object) => {
            return object[fieldName] >= minValue && object[fieldName] <= maxValue;
        }
    }
}

const starRatingFilter: ((values: StarRating[]) => (object: Hotel) => boolean) = createSomeDistinctValueFilter(`starRating`);

const fiveStarRatingPredicate = starRatingFilter([StarRating.FIVE]);

const pricePerRoomFilter: ((minValue: EURAmount, maxValue: EURAmount) => (object: Hotel) => boolean) = createRangeValueFilter(`pricePerRoom`);

const afforableRoomPredicate = pricePerRoomFilter(numberToEURAmount(0), numberToEURAmount(100));

console.log(`5* Hotels:`)
console.log(hotels.filter(fiveStarRatingPredicate).map(hotel => `* ${hotel.name}`).join(`\n`));

console.log(`Affordable Hotels:`)
console.log(hotels.filter(afforableRoomPredicate).map(hotel => `* ${hotel.name}`).join(`\n`));
