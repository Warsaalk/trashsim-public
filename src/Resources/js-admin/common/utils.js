(function (module) {
    /**
     *
     * @param a
     * @param b
     * @returns {boolean}
     */
    function compareProperty (a, b)
    {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) {
                let foundInB = 0, aa = a.slice(), bb = b.slice();

                if ((aa.length > 0 && Object.prototype.toString.call(aa[0]) === "[object Object]") ||
                    (bb.length > 0 && Object.prototype.toString.call(bb[0]) === "[object Object]")) {
                    aa = aa.map(item => JSON.stringify(item));
                    bb = bb.map(item => JSON.stringify(item));
                }

                for (let i=0,il=aa.length;i<il;i++) {
                    if (bb.indexOf(aa[i]) === i) foundInB++;
                }

                return aa.length === bb.length && foundInB === bb.length;
            } else {
                return false;
            }
        } else {
            return a === b;
        }
    }

    /**
     * Get the object difference, this returns only the changes visible in object 1
     *
     * @param newObject
     * @param oldObject
     * @returns {*}
     */
    module.getObjectDifference = function (newObject, oldObject)
    {
        if (typeof oldObject !== 'object' || oldObject === null || oldObject.toString() !== "[object Object]") return newObject;

        let difference = {};

        for (const key in newObject) {
            if (Object.prototype.toString.call(newObject[key]) === "[object Object]") {
                difference[key] = module.getObjectDifference(newObject[key], oldObject[key]);
            } else {
                if (compareProperty(newObject[key], oldObject[key]) === false) {
                    difference[key] = newObject[key];
                }
            }
        }

        for (const key in oldObject) {
            if (newObject[key] === void 0) {
                difference[key] = undefined;
            }

            if (Object.prototype.toString.call(oldObject[key]) === "[object Object]" &&
                Object.prototype.toString.call(difference[key]) === "[object Object]" && (
                    (Object.keys(newObject[key]).length > 0 && Object.keys(difference[key]).length === 0) ||
                    (Object.keys(newObject[key]).length === 0 && Object.keys(difference[key]).length === 0 && Object.keys(oldObject[key]).length === 0)
                )) {
                delete difference[key]; // This means the newObject have no new properties, so it's not necessary to keep the object
            }
        }

        return difference;
    };

    /**
     *
     * @param keys
     * @param obj
     * @returns {*}
     */
    module.getObjectProperty = (keys, obj) => keys.reduce((acc, curr) => (acc && acc[curr] !== void 0) ? acc[curr] : null, obj);

    /**
     *
     * @param keys
     * @param obj
     * @param value
     * @returns {*}
     */
    module.setObjectProperty = (keys, obj, value) => {
        const curr = keys.shift();

        if (keys.length === 0) {
            obj[curr] = value;
        } else {
            if (Object.prototype.toString.call(obj[curr]) !== "[object Object]") {
                obj[curr] = {};
            }

            module.setObjectProperty(keys, obj[curr], value);
        }
    };

    /**
     *
     * @param keys
     * @param obj
     * @returns {*}
     */
    module.deleteObjectProperty = (keys, obj) => keys.reduce((acc, curr) => (acc && acc[curr] !== void 0) ? delete acc[curr] : null, obj);

    /**
     *
     * @param value
     * @param search
     * @param replacement
     * @returns {string|number|boolean}
     */
    function replaceByType (value, search, replacement)
    {
        if (typeof value === "string") {
            if (value.indexOf(search) >= 0) {
                value = value.replace(search, replacement);
            }
        } else if (typeof value === "boolean") {
            let boolean = value.toString();

            if (boolean.indexOf(search) >= 0) {
                value = JSON.parse(boolean.replace(search, replacement));
            }
        } else if (typeof value === "number") {
            let number = value.toString();

            if (number.indexOf(search) >= 0) {
                value = new Number(number.replace(search, replacement));
            }
        }

        return value;
    }

    /**
     *
     * @param arr
     * @param search
     * @param replacement
     * @returns {*}
     */
    module.replaceInArrayValues = (arr, search, replacement) => {
        for (let i=0, il=arr.length; i<il; i++) {
            if (Object.prototype.toString.call(arr[i]) === "[object Object]") {
                arr[i] = module.replaceInObjectValues(arr[i], search, replacement);
            } else if (Array.isArray(arr[i])) {
                arr[i] = module.replaceInArrayValues(arr[i], search, replacement);
            } else {
                arr[i] = replaceByType(arr[i], search, replacement);
            }
        }

        return arr;
    };

    /**
     *
     * @param obj
     * @param search
     * @param replacement
     * @returns {*}
     */
    module.replaceInObjectValues = (obj, search, replacement) => {
        for (const key in obj) {
            if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
                obj[key] = module.replaceInObjectValues(obj[key], search, replacement);
            } else if (Array.isArray(obj[key])) {
                obj[key] = module.replaceInArrayValues(obj[key], search, replacement);
            } else {
                obj[key] = replaceByType(obj[key], search, replacement);
            }
        }

        return obj;
    };

    /**
     * Thanks to https://github.com/davidmarkclements/rfdc
     *
     * @param opts
     * @returns {*}
     */
    module.deepClone = (opts) => {
        opts = opts || {}

        return opts.proto ? cloneProto : clone

        function cloneArray (a, fn) {
            var keys = Object.keys(a)
            var a2 = new Array(keys.length)
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i]
                var cur = a[k]
                if (typeof cur !== 'object' || cur === null) {
                    a2[k] = cur
                } else if (cur instanceof Date) {
                    a2[k] = new Date(cur)
                } else {
                    a2[k] = fn(cur)
                }
            }
            return a2
        }

        function clone (o) {
            if (typeof o !== 'object' || o === null) return o
            if (o instanceof Date) return new Date(o)
            if (Array.isArray(o)) return cloneArray(o, clone)
            var o2 = {}
            for (var k in o) {
                if (Object.hasOwnProperty.call(o, k) === false) continue
                var cur = o[k]
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur)
                } else {
                    o2[k] = clone(cur)
                }
            }
            return o2
        }

        function cloneProto (o) {
            if (typeof o !== 'object' || o === null) return o
            if (o instanceof Date) return new Date(o)
            if (Array.isArray(o)) return cloneArray(o, cloneProto)
            var o2 = {}
            for (var k in o) {
                var cur = o[k]
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur)
                } else {
                    o2[k] = cloneProto(cur)
                }
            }
            return o2
        }
    };

    /**
     * Deep merge Objects, Arrays & Variables
     *
     * @param {...any} sources
     * @return {Object}
     */
    module.deepMerge = (...sources) =>
    {
        let copy = null;

        if (sources.length > 0) {
            if (Object.prototype.toString.call(sources[0]) === "[object Object]") {
                copy = {};

                for (let i = 0, il = sources.length; i < il; i++) {
                    deepCopy(copy, sources[i]);
                }
            } else if (Array.isArray(sources[0])) {
                copy = [];

                for (let i = 0, il = sources.length; i < il; i++) {
                    deepCopyArray(copy, sources[i]);
                }
            } else {
                copy = sources[sources.length - 1];
            }
        }

        return copy;
    };

    /**
     *
     * @param {Array} target
     * @param {Array} source
     * @returns {*[]}
     */
    function deepCopyArray (target, source)
    {
        if (typeof target === "undefined") target = [];

        const keys = Object.keys(source);

        for (let i = 0; i < keys.length; i++) {
            let k = keys[i]
            let cur = source[k];

            if (typeof cur !== 'object' || cur === null) {
                target[k] = cur;
            } else if (cur instanceof Date) {
                target[k] = new Date(cur);
            } else {
                target[k] = deepCopy(target[k], cur);
            }
        }
        return target;
    }

    /**
     *
     * @param {any} target
     * @param {any} source
     * @returns {{}|*[]|Date|*}
     */
    function deepCopy (target, source)
    {
        if (typeof source !== 'object' || source === null) return source;

        if (source instanceof Date) return new Date(source);

        if (Array.isArray(source)) return deepCopyArray(target, source);

        if (typeof target === "undefined") target = {};

        for (const k in source) {
            if (Object.hasOwnProperty.call(source, k) === false) continue;

            let cur = source[k];

            if (typeof cur !== 'object' || cur === null) {
                target[k] = cur;
            } else if (cur instanceof Date) {
                target[k] = new Date(cur);
            } else {
                target[k] = deepCopy(target[k], cur);
            }
        }
        return target;
    }

    /**
     *
     * @param defaultData
     * @param mergeData
     * @param properties
     */
    module.mergeWithDefault = (defaultData, mergeData, properties) =>
    {
        if (Array.isArray(properties)) {
            for (const property of properties) {
                const
                    keys = property.split('.'),
                    defaultSubData = module.getObjectProperty(keys, defaultData),
                    projectSubData = module.getObjectProperty(keys, mergeData);

                module.setObjectProperty(keys, mergeData, module.deepMerge(defaultSubData, projectSubData));
            }
        } else {
            mergeData = module.deepMerge(defaultData, mergeData);
        }

        return mergeData;
    };

    /**
     *
     * @param milliseconds
     * @returns {Promise<unknown>}
     */
    module.sleep = milliseconds =>
    {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

})(c.Utils = {});