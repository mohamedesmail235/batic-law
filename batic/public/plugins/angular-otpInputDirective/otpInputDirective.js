/*
 * author: Amstel D'Almeida
 * email: amstel91@gmail.com
 * https://github.com/amstel91/otp-input-directive
 */
angular.module("otpInputDirective", [])
    .directive('otpInputDirective', ['$timeout', function ($timeout) {
        return {
            restrict: 'A', // restrict by attribute
            scope: {
                options: "="
            },
            template: "<div>" +
                "<input type='{{type}}' ng-repeat=\"c in characters\" inputmode=\"numeric\" pattern=\"[0-9]\" autocomplete=\"one-time-code\" numbers-only ng-keyup='onKeyUp($index,$event)' ng-keydown='onKeyDown($index,$event)' ng-model='c.value' id='otpInput{{c.index}}' name='otpInput{{c.index}}' class='input-otp-control' ng-style=\"style\" placeholder=\"{{placeholder}}\" maxlength=\"{{maxlength}}\"  />\n" +
                "</div>",
            link: function ($scope, elem) {
                var size = parseInt($scope.options.size) || 6;
                var width = 100 / (size + 1);
                var margin = width / size;
                var tmp = [],
                    elementArr = [];
                var DEFAULT_COLOR = "#6f6d6d";
                //generating a random number to attach to id
                var randomNumber = Math.floor(Math.random() * 10000) + 100
                $scope.style = {
                    "margin-right": margin + "%",
                    "border": "none",
                    "border-bottom": "2px solid",
                    "border-radius": "0",
                    "display": "inline-block",
                    "width": width + "%",
                    "text-align": "center",
                    "padding": "5px 0px",
                    "outline": "none",
                    "box-shadow": "none",
                    "background": "transparent",
                    "border-color": $scope.options.style && $scope.options.style.lineColor ? $scope.options.style.lineColor : DEFAULT_COLOR,
                    "color": $scope.options.style && $scope.options.style.color ? $scope.options.style.color : DEFAULT_COLOR,
                    "font-size": $scope.options.style && $scope.options.style.fontSize ? scope.options.style.fontSize : "20px"
                };

                $scope.type = $scope.options.type ? $scope.options.type : "text";
                $scope.placeholder = $scope.options.placeholder && $scope.options.placeholder.length === 1 ? $scope.options.placeholder : "";
                $scope.maxlength = $scope.options.maxlength ? $scope.options.maxlength : 1;

                $scope.setOtpValue = function () {
                    $scope.options.value = "";
                    var done = true;
                    angular.forEach($scope.characters, function (v, k) {
                        let value = String(v.value);
                        if (value.length !== 1) {
                            done = false;
                            return false;
                        }
                        $scope.options.value = $scope.options.value + value;
                    });
                    if (done) {
                        if (typeof ($scope.options.onDone) === "function") {
                            $scope.options.onDone($scope.options.value, elem);
                        }
                    }
                };

                $scope.onKeyUp = function (index, e) {
                    var key = e.keyCode || e.which;
                    var old = $scope.options.value;
                    $scope.setOtpValue();
                    let value = String($scope.characters[index].value);
                    if (value.length > 0 && key !== 8 && index != size - 1) {
                        $timeout(function () {
                            elementArr[index + 1][0].focus();
                        });
                    }
                    if (typeof ($scope.options.onChange) === "function" && old !== $scope.options.value) {
                        $scope.options.onChange($scope.options.value);
                    }

                };

                $scope.onKeyDown = function (index, e) {
                    var key = e.keyCode || e.which;
                    let value = String($scope.characters[index].value);
                    if (key === 8 && value === "" && index !== 0) {
                        $timeout(function () {
                            elementArr[index - 1][0].focus();
                        });
                    }
                };

                elem.bind("paste", function (e) {
                    // access the clipboard using the api
                    var pastedData = e.originalEvent.clipboardData.getData('text');
                    console.log(pastedData.toString().split(''));
                    for (var i = 0; i < size; i++) {
                        $(elementArr[i]).val(pastedData[i]).trigger('input');
                        $(elementArr[i]).trigger('keyup');
                        $(elementArr[i]).trigger('blur');
                    }
                });

                for (var i = 0; i < size; i++) {
                    tmp.push({
                        index: randomNumber + "-" + i,
                        value: ""
                    });
                }
                $scope.characters = tmp;

                $timeout(function () {
                    $(elementArr[0]).trigger('focus');
                }, 100);

                $timeout(function () {
                    for (var i = 0; i < size; i++) {
                        elementArr.push(angular.element(document.querySelector("#otpInput" + randomNumber + "-" + i)));
                    }
                });

                angular.element(document).on('focus input', '.__otp-form-control', function () {
                    let value = String($(this).val());
                    let value_array = value.split('');
                    value_array.map((code, index) => {
                        console.log('------value-' + index, code);
                        for (var i = index; i <= value_array.length; i++) {
                            $(elementArr[i]).val('').trigger('input');
                        }
                        $(elementArr[index]).val(code).trigger('input');
                    })
                    if (!value.length || (value.length == 1)) {
                        if (!value.length) {
                            for (var i = 0; i < 6; i++) {
                                $(elementArr[i]).val('').trigger('input');
                            }
                        }
                        $(elementArr[0]).addClass('input-otp-focus');
                        for (var i = 1; i <= 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    } else if (value.length == 2) {
                        $(elementArr[1]).addClass('input-otp-focus');
                        for (var i = 2; i <= 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    } else if (value.length == 3) {
                        $(elementArr[2]).addClass('input-otp-focus');
                        for (var i = 3; i <= 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    } else if (value.length == 4) {
                        $(elementArr[3]).addClass('input-otp-focus');
                        for (var i = 4; i <= 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    } else if (value.length == 5) {
                        $(elementArr[4]).addClass('input-otp-focus');
                        for (var i = 5; i <= 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    } else if (value.length == 6) {
                        $(elementArr[5]).addClass('input-otp-focus');
                        for (var i = 6; i <= 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    } else {
                        for (var i = 0; i < 6; i++) {
                            $(elementArr[i]).removeClass('input-otp-focus');
                        }
                    }
                });
                angular.element(document).on('blur', '.___otp-form-control', function () {
                    for (var i = 0; i < 6; i++) {
                        $(elementArr[i]).removeClass('input-otp-focus');
                    }
                });

            }

        }
    }]);
