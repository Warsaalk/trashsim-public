
    class ResultHydrator
    {
        static hydrateFromObject (data)
        {
            if (data !== null && data.outcome !== void 0 && data.simulations !== void 0 && data.cases !== void 0) {
                return new Result(data.outcome, data.simulations, data.cases, data.activeCase);
            }

            return null;
        }
    }