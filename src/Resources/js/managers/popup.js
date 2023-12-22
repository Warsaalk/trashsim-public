
    trashSimApp.factory('popupManager', ['$compile', ($compile) =>
    {
        let popups = [], ID = 0;

        const openPopup = (element, $scope) =>
        {
            let clone = $compile(element)($scope.$new(true));

            $$.element(document.getElementById("popup")).append(clone);

            clone.scope().$on("$destroy", closePopup);
            clone.scope().popupID = ++ID;

            popups.push({element: clone, ID: ID});
        };

        const closePopup = event =>
        {
            let ID = event.currentScope.popupID;
            if (ID) {
                let popupIndex = popups.findIndex(popup => popup.ID === ID);
                if (popupIndex >= 0) {
                    angular.element(popups[popupIndex].element).remove();

                    popups.splice(popupIndex, 1);
                }
            }

        };

        return {
            open: openPopup
        };
    }]);