
    class Result
    {
        constructor (outcome, simulations, cases, activeCase)
        {
            this.outcome = outcome;

            this.cases = cases;
            this.simulations = simulations;

            this.selectCase(activeCase || "average");
        }

        selectCase (label)
        {
            if (this.cases.hasOwnProperty(label)) {
                if (this.selectSimulation(this.cases[label])) {
                    this.activeCase = label;

                    return true;
                }
            }

            return false;
        }

        selectSimulation (index)
        {
            if (index >= 0 && index < this.simulations.length) {
                this.activeCase = null;
                this.activeSimulation = this.simulations[index];

                return true;
            }

            return false;
        }

        getData ()
        {
            return {
                outcome: this.outcome,
                cases: this.cases,
                simulations: this.simulations,
                activeCase: this.activeCase
            };
        }
    }