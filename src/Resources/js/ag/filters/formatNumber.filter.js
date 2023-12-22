
    trashSimApp.filter('formatNumber', () =>
    {
        return (input, fallback) =>
        {
            if (isNaN(input)) return fallback;

            return Math.round(input).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };
    });