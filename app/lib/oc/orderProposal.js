//Requires pdfMake.js

angular.module('PremierPrint-OrderProposal', []);

angular.module('PremierPrint-OrderProposal')
    .directive('orderproposal', orderproposal)
    .controller('OrderProposalCtrl', OrderProposalCtrl)  
    .factory('OrderProposal', OrderProposal)  
    .filter('filterAndSortProposalFields', filterAndSortProposalFields)
    .filter('filterNonEmptyProposalFields', filterNonEmptyProposalFields)
    .constant('proposalFieldNames', ["proposalName", "proposalCompany", "proposalEmail", "proposalPhone", "proposalNotes"])    
;

//Directive (template)
function orderproposal() {
    return {
        restrict: 'E',
        scope:{ 
            proposal : '=', 
        },
        template: template,
        controller: 'OrderProposalCtrl'
    };

    function template() {
        return [
            '<div class="panel panel-default panel-order" ng-hide="!proposalIsConfigured">',
                '<div class="panel-heading" ng-class="{\'open\': $parent.checkOutSection == \'proposal\'}">',
                    '<h3 ng-click="$parent.checkOutSection = \'proposal\'" class="panel-title">',
                        '<i class="fa fa-info-circle pull-left"></i>',
                        '{{\'Proposal\' | r}}',
                        '<i class="pull-right" ng-class="{\'fa fa-caret-up\': $parent.checkOutSection == \'proposal\', \'fa fa-caret-down\': $parent.checkOutSection != \'proposal\'  }"></i>',
                    '</h3>',
                '</div>',
                '<div collapse="$parent.checkOutSection != \'proposal\'" class="panel-body">',
                    '<div>',
                        '<span>',
                            '<button class="btn btn-default" type="button" ng-click="printProposal()">',
                               'Print Proposal',
                            '</button>',
                             '<button ng-hide="showProposalEdit" class="btn btn-info pull-right" type="button" ng-click="showProposalEdit = true" tabindex="-1">',
                                 '{{ showProposalReview ? \'Edit\' : \'New\' }}',
                             '</button>',
                        '</span>',
                    '</div>',
                    '<div ng-hide="!showProposalEdit">',
                        '<form name="proposalEdit" ng-submit="save()" class="view-form-icon">',
                            '<div ng-repeat="field in proposal.OrderFields | filterAndSortProposalFields">',
                                '<div ng-if="field.Name == \'proposalCompany\'">',
                                   '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-user"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalName\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-user"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalPhone\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" ui-mask="{{field.MaskedInput}}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-phone"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalEmail\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-envelope"></i>',
                                '</div>',
                            '</div>',
                            '<div class="panel-footer">',
                                '<button class="btn btn-warning" type="button" ng-click="cancel()">{{\'Cancel\' | r | xlat}}</button>',
                                '<button class="btn btn-primary pull-right" type="submit">',
                                    '<i ng-show="addressEdit.$invalid" class="fa fa-warning"></i>',
                                    '{{\'Save\' | r | xlat}}',
                                '</button>',
                            '</div>',
                        '</form>',
                    '</div>',
                    '<div ng-hide="!showProposalReview || showProposalEdit" class="order-location">',
                        '<div ng-repeat="field in proposal.OrderFields | filterAndSortProposalFields">',
                            '<p ng-show="field.Value && $last">&nbsp;</p>',
                            '<p ng-show="field.Value" ng-class="field.Name"><small>{{field.Value}}</small></p>',
                    '</div>',
                '</div>',
                '<div style="display:none"><img id="proposalTempImg" /></div>',
            '</div>',
        ].join('');
    }
}

//Controller
OrderProposalCtrl.$inject = ['$scope', '$routeParams', '$filter', '$rootScope', '$451', 'Order', 'User', 'proposalFieldNames', 'OrderProposal'];
function OrderProposalCtrl($scope, $routeParams, $filter, $rootScope, $451, Order, User, proposalFieldNames, OrderProposal) {
    $scope.proposalIsConfigured = false;
    $scope.showProposalReview = false;
    $scope.showProposalEdit = false;

    //Check if any of the proposal order fields are enabled for this user
    angular.forEach($scope.proposal.OrderFields, function(field){
        angular.forEach(proposalFieldNames, function(proposalFieldName){
            if(field.Name.toLowerCase() == proposalFieldName.toLowerCase()){
                _initScopeSetup(field);
            }
        });
    });

    function _initScopeSetup(field){
        $scope.proposalIsConfigured = true;
        if(field.Value && field.Value.trim().length > 0)
            $scope.showProposalReview = true;
    }

    $scope.cancel = function(){
        angular.forEach($scope.proposal.OrderFields, function(field){
            angular.forEach(proposalFieldNames, function(proposalFieldName){
                if(field.Name.toLowerCase() == proposalFieldName.toLowerCase()){
                    field.Value = "";
                }
            });
        });

        $scope.$parent.saveChanges();
        $scope.showProposalReview = false;
        $scope.showProposalEdit = false;
    }   

    $scope.save = function(){
        $scope.$parent.saveChanges();
        $scope.showProposalEdit = false;
        $scope.showProposalReview =  $filter('filterNonEmptyProposalFields')($scope.proposal.OrderFields).length > 0;
    }

    $scope.printProposal = function(){
        OrderProposal.open($scope.proposal, $scope.$parent.user);
    }
}

//Filters
filterAndSortProposalFields.$inject = ['proposalFieldNames'];
function filterAndSortProposalFields(proposalFieldNames){
    return function(fields){
        var results = [];
        angular.forEach(proposalFieldNames, function(fieldName){
            angular.forEach(fields, function(field){
                if(field.Name.toLowerCase() == fieldName.toLowerCase()){
                    results.push(field);
                }
            });
        });
        return results;
    }
}
function filterNonEmptyProposalFields(){
    return function(fields){
        var results = [];
        angular.forEach(fields, function(field){
            if(field.Name.toLowerCase().indexOf("proposal") === 0 && field.Value && field.Value.trim().length > 0){
                results.push(field);
            }
        });
        return results;
    }
}

//Factory
OrderProposal.$inject = ['$filter', 'Address', 'proposalFieldNames'];
function OrderProposal($filter, Address, proposalFieldNames) {
    var _user;
    var _order;
    var _shipAddress;
    var _billAddress;    
    var _proposalDetails = { Name:"", Company:"", Email:"", Phone:"", Notes:"" };

    function createProposal(){
        return {
            content: [
                //header
                {
                    style:'text',
                    layout:'headerLineOnly',
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: _getHeaderContent()
                    }
                    
                },
                '\n',

                //proposal data
                _getProposalDetailsContent(),
                '\n',

                //shipping and billing
                {
                    style:'text',
                    table: {
                        headerRows: 0,
                        widths: ['43.75%', '12.5%', '43.75%'],
                        body: _getAddressesContent()
                    },
                    layout: {
                        hLineWidth:  function (i, node) { return 1; },
                        vLineWidth: function (i, node) { return 1; },
                        hLineColor: function (i, node) { return 'gray'; },
                        vLineColor: function (i, node) { return 'gray'; },
                        paddingLeft: function(i, node) { return 10; },
                        paddingRight: function(i, node) { return 10; },
                        // paddingTop: function(i, node) { return 2; },
                        // paddingBottom: function(i, node) { return 2; },
                        // fillColor: function (i, node) { return null; }
                    },
                    margin: [30, 0]
                },         
                '\n',

                //shipping method and account?
                _getShippingMethod(),
                '\n',

                //line items
                {
                    style: 'text',
                    layout: 'lightHorizontalLines',
                    table: {
                        headerRows: 1,
                        widths: ['10%', '25%', '40%', '12.5%', '12.5%'],
                        body: _getLineItemsTableContent()
                    }
                    
                },
                '\n',

                //Notes and totals
                {
                    style:'text',
                    table: {
                        headerRows: 0,
                        widths: ['62.5%', '12.5%', '12.5%', '12.5%'],
                        body: _getNotesAndTotalsContent()
                    },
                    layout: {
                        hLineWidth:  function (i, node) { return 1; },
                        vLineWidth: function (i, node) { return 1; },
                        hLineColor: function (i, node) { return 'gray'; },
                        vLineColor: function (i, node) { return 'gray'; }
                        // paddingLeft: function(i, node) { return 4; },
                        // paddingRight: function(i, node) { return 4; },
                        // paddingTop: function(i, node) { return 2; },
                        // paddingBottom: function(i, node) { return 2; },
                        // fillColor: function (i, node) { return null; }
                    }
                }
            ],
            styles: {
                bold: {
                    bold:true
                },
                right: {
                    alignment:'right'
                },
                text: {
                    fontSize: 8
                },
                title: {
                    fontSize:14
                }
            },
            pageMargins: [ 20, 20, 20, 20 ]
        };
    }

    function _getHeaderContent(){
        var rows = [];

        rows.push([
            _getLogoContent(),
            { text:'PROPOSAL', style:['bold','right','title'] }
        ]);

        rows.push([
            [ _user.Company.Name, _getCompanyAddress() ],
            { text:'Date: ' + $filter('date')(new Date(), 'MM/dd/yyyy'), style:'right' }
        ]);

        return rows;
    }

    function _getLogoContent(){
        /*if(_user.Company.LogoUrl)
            return { image:_getBase64URL(_user.Company.LogoUrl), height:100 };
        else */
            return "";
    }

    function _getCompanyAddress(){
        return "";
    }

    function _getProposalDetailsContent(){
        var result = []
        if(_proposalDetails.Company) result.push({ text:_proposalDetails.Company, style:['text','bold'] });
        if(_proposalDetails.Name) result.push({ text:_proposalDetails.Name, style:['text','bold'] });        
        if(_proposalDetails.Phone) result.push({ text:"Phone: " + _formatPhone(_proposalDetails.Phone), style:'text' });
        if(_proposalDetails.Email) result.push({ text:"Email: " + _proposalDetails.Email, style:'text' });
        return result;
    }

    function _getAddressesContent(){
        var rows = [];
        
        rows.push([
            'Bill To:',
            { text:'\n', border:[true, false, true, false] },
            'Ship To:'
        ]);

        rows.push([
            { text:_getAddressDetails(_billAddress), border:[false,true,false,false] },
            { text:'\n', border:[false, false, false, false] },
            { text:_getAddressDetails(_shipAddress), border:[false,true,false,false] },
        ])

        return rows;
    }

    function _getAddressDetails(address){
        var result = [];
        if(address){
            if(address.CompanyName) result.push(address.CompanyName + '\n');
            if(address.FirstName || address.LastName) result.push(address.FirstName + ' ' + address.LastName + '\n');
            if(address.Street1) result.push(address.Street1 + '\n');
            if(address.Street2) result.push(address.Street2 + '\n');
            if(address.City || address.State || address.Zip) result.push(address.City + ((address.City && address.State) ? ', ':'') + address.State + ' ' + address.Zip + '\n');
            result.push('\n');
            if(address.Phone) result.push("Phone: " + _formatPhone(address.Phone) + '\n');
            if(address.Email) result.push("Email: " + address.Email + '\n');
        }
        return result;
    }

    function _getShippingMethod(){
        var result = [];
        result.push({ text:'Ship Via', style:['text','bold'] });
        if(_order.LineItems[0].ShipperName) result.push({ text:_order.LineItems[0].ShipperName, style:'text' });
        return result;
    }

    function _getLineItemsTableContent(){
        var rows = [];
        //Header
        rows.push([ 
            { text:'Qty', style:['right','bold'] },
            { text:'Item #', style:['bold'] },
            { text:'Description', style:['bold'] },
            { text:'Unit Price', style:['right','bold'] },
            { text:'Ext Price', style:['right','bold'] },
        ]);
        
        //Line Item data
        if(_order && _order.LineItems && _order.LineItems.length > 0){
            angular.forEach(_order.LineItems, function(lineItem){
                rows.push([
                    { text:lineItem.Quantity, style:'right' },
                    lineItem.Product.ExternalID,
                    _getLineItemDescription(lineItem),
                    { text:$filter('culturecurrency')(lineItem.UnitPrice), style:'right' },
                    { text:$filter('culturecurrency')(lineItem.LineTotal), style:'right' }
                ]);
            });
        }        

        return rows;
    }

    function _getLineItemDescription(lineItem){
        if(lineItem.Specs && lineItem.SpecsLength > 0){
            var result = [];
            result.push(lineItem.Product.Name);
            angular.forEach(lineItem.Specs, function(spec){
                if(spec.CanSetForLineItem || spec.ControlType == "Selection"){
                    result.push(
                        ((spec.Label) ? spec.Label : spec.Name) + ': ' +
                        ((spec.ControlType == 'File') ? spec.File.OriginalName + spec.File.Extension : ((spec.Value) ? spec.Value : 'unspecified') )
                    )
                }
            });
            return result;
        } else {
            return lineItem.Product.Name;
        }        
    }

    function _getNotesAndTotalsContent(){
        var rows = [];
        rows.push([
            { text: "Notes: \n" + _proposalDetails.Notes, rowSpan:4 },
            { text:'\n', border: [true, false, true, false] },
            { text:'Subtotal', border:[true,true,false,true] },
            { text:$filter('culturecurrency')(_order.Subtotal), style:'right', border:[false,true,true,true] }
        ]);
        rows.push([
            '',
            { text:'\n', border: [true, false, true, false] },
            { text:'Shipping', border:[true,true,false,true] },
            { text:$filter('culturecurrency')(_order.ShippingCost), style:'right', border:[false,true,true,true] }
        ]);
        rows.push([
            '',
            { text:'\n', border: [true, false, true, false] },
            { text:'Tax', border:[true,true,false,true] },
            { text:$filter('culturecurrency')(_order.TaxCost), style:'right', border:[false,true,true,true] }
        ]);
        rows.push([
            '',
            { text:'\n', border: [true, false, true, false] },
            { text:'Total', style:'bold', border:[true,true,false,true] },
            { text:$filter('culturecurrency')(_order.Total), style:['bold','right'], border:[false,true,true,true] }
        ]);

        return rows;
    }

    function _formatPhone(phone){
        var result = "";
        if(phone){
            //normalize string and remove all unnecessary characters
            phone = phone.replace(/[^\d]/g, "");

            //check if number length equals to 10
            if (phone.length == 10) {
                //reformat and return phone number
                result = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            }
        }
        return result;
    }

    function setup(order, user){
        _order = order;
        _user = user;

        var pfields = $filter('filterAndSortProposalFields')(_order.OrderFields);
        _proposalDetails.Name = pfields[0].Value;
        _proposalDetails.Company = pfields[1].Value;
        _proposalDetails.Email = pfields[2].Value;
        _proposalDetails.Phone = pfields[3].Value;
        _proposalDetails.Notes = pfields[4].Value;

        if(_order && _order.ShipAddressID){
            Address.get(_order.ShipAddressID, function(add) {
                _shipAddress = add;
            })
        }

        if(_order && _order.BillAddressID){
            Address.get(_order.BillAddressID, function(add) {
                _billAddress = add;
            })
        }        
    }

    return {
        print: function(order, user) {
            setup(order, user);
		    var docDefinition = createProposal();
            pdfMake.createPdf(docDefinition).print();
	    },
        download: function(order, user) {
            _setup(order, user);
		    var docDefinition = createProposal();
            pdfMake.createPdf(docDefinition).download();
	    },
        open: function(order, user) {
            setup(order, user);
		    var docDefinition = createProposal();
            pdfMake.createPdf(docDefinition).open();
	    },
    }
}