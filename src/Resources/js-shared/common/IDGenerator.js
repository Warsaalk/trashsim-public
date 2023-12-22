
    let IDGenerator = function* (ID) {
        while (true) {
            yield ID++;
        }
    }(0);