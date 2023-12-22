
    trashSimApp.filter('formatDuration', () =>
    {
        return input =>
        {
            if (isNaN(input)) return input;

            let seconds = Number(input);

            // calculate (and subtract) whole hours
            let hours = Math.floor(seconds / 3600);// % 24;
            seconds -= hours * 3600;

            // calculate (and subtract) whole minutes
            let minutes = Math.floor(seconds / 60) % 60;
            seconds -= minutes * 60;

            seconds = Math.round(seconds);

            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            return hours + ':' + minutes + ':' + seconds;
        };
    });