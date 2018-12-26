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
        menu.foundItems = [];   
        menu.warningMsg = false;     

        menu.narrowDown = function () 
        {       
            if(menu.searchTerm.trim() == "")
               menu.warningMsg = true;
            else
            {
                menu.foundItems =  MenuSearchService.getMatchedMenuItems(menu.searchTerm);
                menu.warningMsg = false;
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
            var promise = service.getAllMenuItems();
            promise.then(function (response) {
                for(var i=0;i<response.data.menu_items.length;i++)
                {   
                    if(response.data.menu_items[i].name == searchTerm)                                        
                       service.addItem(response.data.menu_items[i]);  
                }                                           
            })
            .catch(function (error) {
                console.log("Something went terribly wrong.");
            });            
            return items;
        };

        service.addItem = function (item) {
            items.push(item);             
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