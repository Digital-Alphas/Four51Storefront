//Requires pdfMake.js

angular.module('PremierPrint-OrderProposal', []);

angular.module('PremierPrint-OrderProposal')
    .directive('orderproposal', orderproposal)
    .controller('OrderProposalCtrl', OrderProposalCtrl)  
    .factory('OrderProposal', OrderProposal)  
    .filter('filterAndSortProposalFields', filterAndSortProposalFields)
    .filter('filterNonEmptyProposalFields', filterNonEmptyProposalFields)
    .constant('proposalFieldNames', ["proposalName", "proposalCompany", "proposalEmail", "proposalPhone", "proposalQuoteNumber",
                                    "proposalClientName", "proposalClientCompany", "proposalClientLocation", "proposalClientEmail", "proposalClientPhone", "proposalNotes"])
    .constant('proposalCompanyName','')
    .constant('proposalCompanyAddress','') //Use "\n" to indicate line breaks e.g. 123 Main St.\nChicago, IL 60606
;

//Directive (template)
function orderproposal() {
    return {
        restrict: 'E',
        scope:{ 
            proposal : '=',
            defaultopen : "="
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
                        '<span class="btn-group">',
                             '<button ng-hide="showProposalEdit" class="btn btn-info pull-right" type="button" ng-click="showProposalEdit = true" tabindex="-1">',
                                '{{ showProposalReview ? \'Edit\' : \'New\' }}',
                             '</button>',
                        '</span>',
                    '</div>',
                    '<div ng-hide="!showProposalEdit">',
                        '<form name="proposalEdit" ng-submit="save()" class="view-form-icon">',
                            '<div ng-repeat="field in proposal.OrderFields | filterAndSortProposalFields">',                                
                                '<div ng-if="field.Name == \'proposalName\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-user"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalCompany\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-user"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalEmail\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-envelope"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalPhone\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" ui-mask="{{field.MaskedInput}}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-phone"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalQuoteNumber\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-hashtag"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalClientName\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-user"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalClientCompany\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-user"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalClientLocation\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-map-marker"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalClientEmail\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" placeholder="{{ field.Label || field.Name }}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-envelope"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalClientPhone\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<input name="{{field.Name}}" class="form-control" ng-trim="{{autotrim || true}}" ui-mask="{{field.MaskedInput}}" size="{{field.Width * .13}}" ng-maxlength="{{field.MaxLength}}" type="text" autocomplete="off" ng-required="field.Required" ng-model="field.Value" />',
                                    '<i class="fa fa-phone"></i>',
                                '</div>',
                                '<div ng-if="field.Name == \'proposalNotes\'">',
                                    '<label>{{ field.Label | xlat }}</label>',
                                    '<textarea name="{{field.Name}}" wrap="hard" class="form-control" ng-attr-placeholder="{{field.Label || field.Name | r}}" cols="{{field.Width * .13}}" rows="{{field.Lines}}" ng-maxlength="{{field.MaxLength}}" ng-model="field.Value"></textarea>',
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
                            '<p ng-show="field.Value && (field.Name == \'proposalNotes\' || field.Name == \'proposalQuoteNumber\' || field.Name == \'proposalClientName\')">&nbsp;</p>',
                            '<p ng-show="field.Value" ng-class="field.Name"><small ng-if="field.Name == \'proposalQuoteNumber\'">#</small><small>{{field.Value}}</small></p>',
                        '</div>',
                    '</div>',
                    '<div ng-hide="!showProposalReview || showProposalEdit" style="margin-top:15px" >',
                        '<span class="btn-group">',
                            '<button class="btn btn-default pull-right" type="button" ng-click="printProposal()">',
                                '<loadingindicator ng-show="printProposalIndicator" />',
                                'Create Proposal',
                            '</button>',
                        '</span>',
                    '</div>',
                '</div>',
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
    $scope.printProposalIndicator = false;

    if($scope.defaultopen) $scope.$parent.checkOutSection = 'proposal';

    if($scope.proposal && $scope.proposal.OrderFields){
        //Check if any of the proposal order fields are enabled for this user
        angular.forEach($scope.proposal.OrderFields, function(field){
            angular.forEach(proposalFieldNames, function(proposalFieldName){
                if(field.Name.toLowerCase() == proposalFieldName.toLowerCase()){
                    _initScopeSetup(field);
                }
            });
        });
    }    

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
        $scope.printProposalIndicator = true;
        OrderProposal.download($scope.proposal, $scope.$parent.user, function(){ $scope.printProposalIndicator = false; });
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
OrderProposal.$inject = ['$q','$http', '$filter', 'Address', 'proposalFieldNames', 'proposalCompanyName', 'proposalCompanyAddress'];
function OrderProposal($q, $http, $filter, Address, proposalFieldNames, proposalCompanyName, proposalCompanyAddress) {
    var _user;
    var _order;
    var _shipAddress;
    var _billAddress;    
    var _proposalDetails = { Name:"", Company:"", Email:"", Phone:"", Notes:"", QuoteNumber:"", ClientName:"", ClientCompany:"", ClientEmail:"", ClientPhone:"", ClientLocation:"" };
    var _proposalImages = [];
    var _lineColor = "black";
    var _lineWidth = 0.5;

    function _getDocument(){
        return {
            header: _getHeaderContent(),

            content: [
                
                //sales rep data
                _getProposalDetailsContent(),
                '\n',

                /*
                //shipping and billing
                _getShippingAndBillingContent(),         
                '\n',
                */

                /*
                //shipping method
                _getShippingMethodContent(),
                '\n',
                */

                _getNotesContent(),
                '\n',

                '\n',
                //line items
                _getLineItemsContent(),
                '\n',

                _getTotalsContent(),

                //Notes and totals
                //_getNotesAndTotalsContent(),
                //'\n'

                _getDisclaimer()
            ],
            footer: function(currentPage, pageCount) {
                return _getFooter(currentPage, pageCount);
            },
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
            pageMargins: [ 20, 120, 20, 40 ],
            pageSize: 'LETTER'
        };
    }

//////////////Header

    function _getHeaderContent(){
        return {
            style:'text',
            margin:[20,20,20,0],
            table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: _getHeaderTableBody()
            },
            layout: 'headerLineOnly'
            /*{
                hLineWidth:  function (i, node) {
                    return (i === 1) ? _lineWidth : 0;
                },
                vLineWidth: function (i, node) { return 0; },
                hLineColor: function (i, node) { return _lineColor; },
                vLineColor: function (i, node) { return _lineColor; },
                paddingLeft: function(i, node) { return 0; },
                paddingRight: function(i, node) { return 0; }
            }*/
            
        }
    }

    function _getHeaderTableBody(){
        var rows = [];

        rows.push([
            _getLogo(),
            { text:'PROPOSAL', style:['bold','right','title'], margin:[0,30,0,0] }
        ]);

        rows.push([
            [ _getCompanyName(), _getCompanyAddress() ],
            [
                { text:'Date: ' + $filter('date')(new Date(), 'MM/dd/yyyy'), style:'right' },
                { text:_getQuoteNumber(), style:'right' }
            ]
        ]);

        return rows;
    }

    function _getLogo(){        
        if(_user.Company.LogoUrl){
            var dataUrl = _getDataUrl(_user.Company.LogoUrl);
            if(dataUrl) return { image:dataUrl, fit: [100, 50] };
        }
        return "";
    }

    function _getCompanyName(){
        if(proposalCompanyName){
            return proposalCompanyName;
        } else {
            return _user.Company.Name;
        }
    }

    function _getCompanyAddress(){
        return proposalCompanyAddress;
    }

    function _getQuoteNumber(){
        if(_proposalDetails.QuoteNumber){
            return "Quote # " + _proposalDetails.QuoteNumber;
        } else {
            return "";
        }
    }

//////////////Proposal Contact fields

    function _getProposalDetailsContent(){
        return {
            columns:[
                {
                    width:'50%',
                    stack: _getProposalSalesRepContent(), 
                    style:'text'
                },
                {
                    width:'50%',    
                    stack: _getProposalClientContent(), 
                    style:'text'
                }
            ]
        }
    }

    function _getProposalSalesRepContent(){
        var result = []
        result.push({ text:"Sales Representative:", style:['text','bold'] });
        if(_proposalDetails.Company) result.push({ text:_proposalDetails.Company, style:['text','bold'] });
        if(_proposalDetails.Name) result.push({ text:_proposalDetails.Name, style:['text','bold'] });
        if(_proposalDetails.Email) result.push({ text:"Email: " + _proposalDetails.Email, style:'text' });
        if(_proposalDetails.Phone) result.push({ text:"Phone: " + _formatPhone(_proposalDetails.Phone), style:'text' });        
        return result;
    }

    function _getProposalClientContent(){
        var result = []
        result.push({ text:"Prepared for:", style:['text','bold'] });
        if(_proposalDetails.ClientCompany) result.push({ text:_proposalDetails.ClientCompany, style:['text','bold'] });
        if(_proposalDetails.ClientName) result.push({ text:_proposalDetails.ClientName, style:['text','bold'] });
        if(_proposalDetails.ClientLocation) result.push({ text:_proposalDetails.ClientLocation, style:'text' });
        if(_proposalDetails.ClientEmail) result.push({ text:"Email: " + _proposalDetails.ClientEmail, style:'text' });
        if(_proposalDetails.ClientPhone) result.push({ text:"Phone: " + _formatPhone(_proposalDetails.ClientPhone), style:'text' });        
        return result;
    }

//////////////Billing and Shipping

    function _getShippingAndBillingContent(){
        return {
            style:'text',
            table: {
                headerRows: 0,
                widths: ['43.75%', '12.5%', '43.75%'],
                body: _getAddressesTableBody()
            },
            layout: {
                hLineWidth:  function (i, node) { return _lineWidth; },
                vLineWidth: function (i, node) { return _lineWidth; },
                hLineColor: function (i, node) { return _lineColor; },
                vLineColor: function (i, node) { return _lineColor; },
                paddingLeft: function(i, node) { return 10; },
                paddingRight: function(i, node) { return 10; }
            },
            margin: [30, 0]
        }
    }

    function _getAddressesTableBody(){
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
            if(address.Email) result.push("Email: " + address.Email + '\n');
            if(address.Phone) result.push("Phone: " + _formatPhone(address.Phone) + '\n');            
        }
        return result;
    }

    function _getShippingMethodContent(){
        return {
            style:'text',
            table: {
                headerRows: 0,
                widths: ['auto'],
                body: _getShippingMethodTableBody()
            },
            layout: {
                hLineWidth:  function (i, node) {
                    return (i === 1) ? 0 : _lineWidth;
                },
                vLineWidth: function (i, node) { return _lineWidth; },
                hLineColor: function (i, node) { return _lineColor; },
                vLineColor: function (i, node) { return _lineColor; }
            }
        }
    }

    function _getShippingMethodTableBody(){
        var rows = [];
        rows.push([{ text:'Ship Via', style:['bold'] }]);
        
        var shipMethod = "\n";
        if(_order.LineItems[0].ShipperName) shipMethod = _order.LineItems[0].ShipperName;
        rows.push([{ text:shipMethod }]);

        return rows;
    }

//////////////Line Items

    function _getLineItemsContent(){
        return {
            style: 'text',
            //layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                dontBreakRows: true,
                widths: ['10%', '15%', '15%', '35%', '12.5%', '12.5%'],
                body: _getLineItemsTableBody()
            },
            layout: {
                hLineWidth:  function (i, node) {
                    return (i === 0 || i === 1 || i === node.table.body.length) ? _lineWidth : 0;
                },
                vLineWidth: function (i, node) {  
                    return (i === 2) ? 0 : _lineWidth;
                },
                hLineColor: function (i, node) { return _lineColor; },
                vLineColor: function (i, node) { return _lineColor; }
            }                    
        }
    }

    function _getLineItemsTableBody(){
        var rows = [];
        //Header
        rows.push([ 
            { text:'Qty', style:['right','bold'] },
            { text:'Item #', colSpan:2, style:['bold'] },
            { text:'' },
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
                    _getLineItemImage(lineItem),
                    _getLineItemDescription(lineItem),
                    { text:$filter('culturecurrency')(lineItem.UnitPrice), style:'right' },
                    { text:$filter('culturecurrency')(lineItem.LineTotal), style:'right' }
                ]);
            });
        }        

        return rows;
    }

    function _getLineItemImage(lineItem){
        var imgUrl = (lineItem.Variant && lineItem.Variant.LargeImageUrl) ? lineItem.Variant.LargeImageUrl : (lineItem.Product.SmallImageUrl);
        if(imgUrl){
            var dataUrl = _getDataUrl(imgUrl);
            if(dataUrl) return { image:dataUrl, fit: [50, 100] };
        }        
        return "";
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

//////////////Notes and Totals

    function _getNotesAndTotalsContent(){
        return {
            columns:[
                {
                    width:'62%',
                    stack: _getNotesContent(), 
                    style:'text'
                },
                {
                    width:'12%',    
                    text:'\n'
                },
                {
                    width:'26%',
                    stack: [         
                        {
                            style:'text',
                            table: {
                                widths: ["*", "*"],
                                body: _getTotalsTableBody()
                            },
                            layout: {
                                hLineWidth:  function (i, node) { return _lineWidth; },
                                vLineWidth: function (i, node) { return _lineWidth; },
                                hLineColor: function (i, node) { return _lineColor; },
                                vLineColor: function (i, node) { return _lineColor; }
                            }
                        }
                    ]    
                }
            ]
        }
    }

    function _getNotesContent(){
        return [
            { text:'Proposal Notes:', style:['bold','text'] },
            { text: _proposalDetails.Notes, style:'text' }           
        ];
    }

    function _getTotalsContent(){
        return {
            columns:[
                {
                    width:'74%',
                    stack: '\n', 
                    style:'text'
                },
                {
                    width:'26%',
                    stack: [         
                        {
                            style:'text',
                            table: {
                                widths: ["*", "*"],
                                body: _getTotalsTableBody()
                            },
                            layout: {
                                hLineWidth:  function (i, node) { return _lineWidth; },
                                vLineWidth: function (i, node) { return _lineWidth; },
                                hLineColor: function (i, node) { return _lineColor; },
                                vLineColor: function (i, node) { return _lineColor; }
                            }
                        }
                    ]    
                }
            ]
        }
    }

    function _getTotalsTableBody(){
        var rows = [];
        rows.push([
            { text:'Subtotal', border:[true,true,true,false] },
            { text:$filter('culturecurrency')(_order.Subtotal), style:'right', border:[true,true,true,false] }
        ]);
        rows.push([
            { text:'Shipping', border:[true,false,true,false] },
            { text:$filter('culturecurrency')(_order.ShippingCost), style:'right', border:[true,false,true,false] }
        ]);
        rows.push([
            { text:'Tax', border:[true,false,true,false] },
            { text:$filter('culturecurrency')(_order.TaxCost), style:'right', border:[true,false,true,false] }
        ]);
        rows.push([
            { text:'Total', style:'bold', border:[true,false,true,true] },
            { text:$filter('culturecurrency')(_order.Total), style:['bold','right'], border:[true,false,true,true] }
        ]);

        return rows;
    }

//////////////Footer
    function _getFooter(currentPage, pageCount){
        if(currentPage == pageCount - 1){
            return [
                {
                    columns:[
                        {
                            width:'62%',
                            text: "Customer Signature: _________________________________________________________________"
                        },
                        {
                            width:'12%',    
                            text:'\n'
                        },
                        {
                            width:'26%',
                            text: "Date: ______________________________"
                        }
                    ],
                    style:['text','bold'],
                    margin: [ 20, 0, 20, 20 ]
                }
            ]
        } else {
            return "";
        }
    }

//////////////Footer
    function _getDisclaimer(){
        return [
            {text:'Estimated Production Time', style:'bold', pageBreak: 'before'},
            'Production time begins after usable artwork is received or a proof is approved. Transit time is not included in the production time.',
            '\n\n',
            {text:'Samples', style:'bold'},
            'Customer authorizes GBC ® to use its customer product sample for the promotion of GBC\'s products and services. Customer approval/no approval of sample program participation will be noted on the GBC custom quotation and specifications forms. GBC understands that the above does not cover website or advertising promotion. In the event GBC wants to use a sample for the above, customer authorization will be obtained prior to publication.',
            '\n\n',
            {text:'Shipping', style:'bold'},
            'GBC reserves the right to ship OVER / UNDER 10% on all custom orders.',
            'Please select your preferred shipping method',
            'Shipping Method:',
            'Best Way',
            'Ground',
            'Next Day Air',
            '2nd Day Air',
            'Other:',
            '\n\n',
            {text:'Purchase Approval', style:'bold'},
            'I authorize the purchase of the associated proposal with the PO# and/or the below signature.',
            'PO # ___________________________________________________',
            'Print Name _____________________________________________',
            'Phone # ________________________________________________',
            'Fax # ___________________________________________________',
            'Email ___________________________________________________',
            'Signature: ______________________________________________',
            '\n',
            'Pricing is valid for 30 days from the quote date.',
            'Terms: Net 30 days F.O.B. - Shipping Point',
            '\n\n',
            'Visit our web site at www.gbcconnect.com'
        ]
    }

//////////////Helpers

    function _formatPhone(phone){
        var result = "";
        if(phone){
            //normalize string and remove all unnecessary characters
            phone = phone.replace(/[^\d]/g, "");

            //check if number length equals to 10
            if (phone.length == 10) {
                //reformat and return phone number
                result = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
            }
        }
        return result;
    }

    function _getDataUrl(imgUrl){
        if(_proposalImages){
            var dataUrl = _proposalImages[imgUrl];
            if(dataUrl) return dataUrl;
        }
        return "";
    }

    function _getImageDataUrls(images){
        return $http.post('https://www.premierprint.com/four51services/api/images/dataurls', images)
            .then(
                function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
        
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                }
            );
    }

    function _getFieldValue(fields, fieldName){
        var results = $filter('filter')(fields, { Name: fieldName })
        if(results && results.length > 0)
            return results[0].Value;
        else
            return "";
    }

    function generateProposal(order, user, callback){
        //Setup local variables
        _order = order;
        _user = user;

        _proposalDetails.Name = _getFieldValue(_order.OrderFields, "proposalName");
        _proposalDetails.Company = _getFieldValue(_order.OrderFields, "proposalCompany");
        _proposalDetails.Email = _getFieldValue(_order.OrderFields, "proposalEmail");
        _proposalDetails.Phone = _getFieldValue(_order.OrderFields, "proposalPhone");
        _proposalDetails.QuoteNumber = _getFieldValue(_order.OrderFields, "proposalQuoteNumber");
        _proposalDetails.ClientName = _getFieldValue(_order.OrderFields, "proposalClientName");
        _proposalDetails.ClientCompany = _getFieldValue(_order.OrderFields, "proposalClientCompany");
        _proposalDetails.ClientLocation = _getFieldValue(_order.OrderFields, "proposalClientLocation");
        _proposalDetails.ClientEmail = _getFieldValue(_order.OrderFields, "proposalClientEmail");
        _proposalDetails.ClientPhone = _getFieldValue(_order.OrderFields, "proposalClientPhone");
        _proposalDetails.Notes = _getFieldValue(_order.OrderFields, "proposalNotes");

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

        var images = [];
        if(_user.Company.LogoUrl) images.push(_user.Company.LogoUrl);
        if(_order && _order.LineItems && _order.LineItems.length > 0){
            angular.forEach(_order.LineItems, function(lineItem){
                var img = (lineItem.Variant && lineItem.Variant.LargeImageUrl) ? lineItem.Variant.LargeImageUrl : (lineItem.Product.SmallImageUrl);
                if(img) images.push(img);
            });
        }
        _getImageDataUrls(images).then(
            function(data) {
                _proposalImages = data;
                var docDefinition = _getDocument();
                callback(docDefinition);
            }, function(error) {
                console.log("Error getting image data urls: " + error);
                var docDefinition = _getDocument();
                callback(docDefinition);
            }
        );
    }

    return {
        print: function(order, user, callback) {
            generateProposal(order, user, function(docDefinition){
                pdfMake.createPdf(docDefinition).print();
                callback();
            });
	    },
        download: function(order, user, callback) {
            generateProposal(order, user, function(docDefinition){
                pdfMake.createPdf(docDefinition).download("OrderProposal_" + $filter('date')(new Date(), 'yyyyMMddHHmmss') + ".pdf");
                callback();
            });
	    },
        open: function(order, user, callback) {
            generateProposal(order, user, function(docDefinition){
                pdfMake.createPdf(docDefinition).open();
                callback();
            });
	    },
    }
}