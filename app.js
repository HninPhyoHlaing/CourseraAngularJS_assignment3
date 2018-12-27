(function()
{
    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService',MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems',FoundItemsDirective);


    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) 
    {
        var menu = this;
        menu.searchTerm = "";
        menu.foundItems =[] ;   
        menu.warningMsg = false;     

        menu.narrowDown = function () 
        {   
            if(menu.searchTerm.trim() == "")
               menu.warningMsg = true;
            else
            {
                MenuSearchService.getMatchedMenuItems(menu.searchTerm)                                    
                                 .then(function (response) 
                                 { 
                                    if(response.length > 0)
                                    {                                        
                                      menu.warningMsg = false;
                                      MenuSearchService.clearItem();
                                      for(var i=0;i<response.length;i++)
                                         menu.foundItems = MenuSearchService.addItem(response[i]);
                                    }
                                    else
                                    {
                                      MenuSearchService.clearItem();  
                                      menu.warningMsg = true;
                                    }

                                 })
                                 .catch(function (error) {
                                     console.log("Something went terribly wrong.");
                                 });                
            }
            
        };

        menu.removeItem = function (itemIndex) 
        {            
            menu.foundItems = MenuSearchService.removeItem(itemIndex);                      
        };        

    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) 
    {
        var service = this;
        var items = [];        

        service.getAllMenuItems = function(){
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")               
                });    
                return response;
        }

        
        service.getMatchedMenuItems = function (searchTerm) {        
            //var promise = service.getAllMenuItems();
            return $http({
                            method: "GET",
                            url: (ApiBasePath + "/menu_items.json")               
                        })
                        .then(function (response) 
                        {
                            var founditem=[];
                            for(var i=0;i<response.data.menu_items.length;i++)
                            {   
                                if(response.data.menu_items[i].description.indexOf(searchTerm) > -1)                                        
                                founditem.push(response.data.menu_items[i]);  
                            } 
                            console.log(founditem);
                            return founditem;                                          
                        });           
           
        };

        service.clearItem = function()
        {
            items = [];
        }

        service.addItem = function (item) {
            items.push(item);   
            return items;          
        };

        service.removeItem = function (itemIndex) {
            items.splice(itemIndex, 1);
            return items;
        };
    }
    
    function FoundItemsDirective() {
        var ddo = {
          templateUrl: 'foundItems.html',
          scope: {
            items: '<',//One-way binding          
            onRemove: '&',//Reference binding OR Method binding,
            searchItem: '@search'
          },
          controller: FoundItemsDirectiveController,
          controllerAs: 'menu',
          bindToController: true
        };      
        return ddo;
      }

      function FoundItemsDirectiveController() {
        var menu = this;
      }
      

})();