
    c.ogotchaManager =
    {
        fetchReport: async function (reportID, apikey)
        {
            return await c.requestManager.post(`${app.config.ogotcha}report/${reportID}`, {apikey});
        }
    };