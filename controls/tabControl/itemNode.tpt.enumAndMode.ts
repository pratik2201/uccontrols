export const dropIndictors = {
    leftPoll: '<drop  dir="left" ></drop>'.$(),
    rightPoll: '<drop  dir="right" ></drop>'.$(),

    indictor: '<indicator  dir="none" ></indicator>'.$(),

   get asArray() {
        return [dropIndictors.indictor,
        dropIndictors.leftPoll,
        dropIndictors.rightPoll];
    },
    possiblePlaces: Object.freeze({
        leftRect: "leftRect",
        rightRect: "rightRect",
        none: "none",
    })
}