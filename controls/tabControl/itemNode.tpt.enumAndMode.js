const dropIndictors = {
    /** @type {container}  */
    leftPoll: '<drop  dir="left" ></drop>'.$(),
    /** @type {container}  */
    rightPoll: '<drop  dir="right" ></drop>'.$(),

    /** @type {container}  */
    indictor: '<indicator  dir="none" ></indicator>'.$(),

    /** @type {container[]}  */
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
module.exports = {
    dropIndictors
}