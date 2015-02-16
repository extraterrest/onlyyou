/**
 * Created by gliu on 1/29/2015.
 */
platformItems24 = [{value: "2000s", lable:"BIGIP 2000s"}, {value: "2200s", lable:"BIGIP 2200s"},{value: "4000s", lable:"BIGIP 4000s"},{value: "4200v", lable:"BIGIP 4200v"}];
platformItems57 = [{value: "5000s", lable:"BIGIP 5000s"}, {value: "5050s", lable:"BIGIP 5050s"},{value: "5200v", lable:"BIGIP 5200v"},{value: "5250v", lable:"BIGIP 5250v"}, {value: "7000s", lable:"BIGIP 7000s"}, {value: "7050s", lable:"BIGIP 7050s"},{value: "7200v", lable:"BIGIP 7200v"},{value: "7250v", lable:"BIGIP 7250v"}];
platformItems10 = [{value: "10000s", lable:"BIGIP 10000s"}, {value: "10050s", lable:"BIGIP 10050s"},{value: "10200v", lable:"BIGIP 10200v"},{value: "10250v", lable:"BIGIP 10250v"},{value: "10350v", lable:"BIGIP 10350v (仅支持直流)"},{value: "12250v", lable:"BIGIP 12250v"}];
platformItemsOld = [{value: "3900", lable:"BIGIP 3900"}, {value: "6900", lable:"BIGIP 6900"},{value: "8950", lable:"BIGIP 8950"}];
platformItemsVPR = [{value: "VIPRION2200", lable:"VIPRION 2200"}, {value: "VIPRION2400", lable:"VIPRION 2400"},{value: "VIPRION4480", lable:"VIPRION 4480"},{value: "VIPRION4800", lable:"VIPRION 4800"}];
platformItemsBld1 = [{value: "B2100", lable:"B2100"}, {value: "B2150", lable:"B2150"},{value: "B2250", lable:"B2250"}];
platformItemsBld2 = [{value: "B4300", lable:"B4300"}, {value: "B4340", lable:"B4340"}];

$(document).ready(function(){
    $('#platform1').change(function(){
        var selected = $(this).find(':selected').text().trim();
        switch (selected.toString()) {
            case "VIPRION":
            {
                $('#moduleLC').attr('disabled', true);
                $("#lablePlatformChassis").text("Select Chassis");
                $('#platform2').empty();
                platformItemsVPR.forEach(function (item) {
                    $('#platform2').append('<option value="' + item.value + '" > ' + item.lable);
                });
                $('#partBlade').show();
                break;
            }
            case "2000/4000 Series":
            {
                $('#moduleLC').attr('disabled', false);
                $("#lablePlatformChassis").text("Select Platform");
                $('#platform2').empty();
                platformItems24.forEach(function (item) {
                    $('#platform2').append('<option value="' + item.value + '" > ' + item.lable);
                });
                $('#partBlade').hide();
                break;
            }
            case "5000/7000 Series":
            {
                $('#moduleLC').attr('disabled', false);
                $("#lablePlatformChassis").text("Select Platform");
                $('#platform2').empty();
                platformItems57.forEach(function (item) {
                    $('#platform2').append('<option value="' + item.value + '" > ' + item.lable);
                });
                $('#partBlade').hide();
                break;
            }
            case "10000 Series":
            {
                $('#moduleLC').attr('disabled', false);
                $("#lablePlatformChassis").text("Select Platform");
                $('#platform2').empty();
                platformItems10.forEach(function (item) {
                    $('#platform2').append('<option value="' + item.value + '" > ' + item.lable);
                });
                $('#partBlade').hide();
                break;
            }
            case "Old Series":
            {
                $('#moduleLC').attr('disabled', false);
                $("#lablePlatformChassis").text("Select Platform");
                $('#platform2').empty();
                platformItemsOld.forEach(function (item) {
                    $('#platform2').append('<option value="' + item.value + '" > ' + item.lable);
                });
                $('#partBlade').hide();
                break;
            }
        }

    }).change();

    $('#platform2').change(function(){
        var selected = $(this).find(':selected').text().trim();
        switch (selected.toString()) {
            case "VIPRION 2200":
            case "VIPRION 2400":
            {
                $('#platform3').empty();
                platformItemsBld1.forEach(function (item) {
                    $('#platform3').append('<option value="' + item.value + '" > ' + item.lable);
                });
                break;
            }
            case "VIPRION 4480":
            case "VIPRION 4800":
            {
                $('#platform3').empty();
                platformItemsBld2.forEach(function (item) {
                    $('#platform3').append('<option value="' + item.value + '" > ' + item.lable);
                });
                break;
            }
        }
    }).change();


    $('.quickSelection').change(function(){
       // alert("test");
        var bundleValue = $('.quickSelection:checked').val();
        switch (bundleValue) {
            case "good":
            {
                $('#moduleLTM').prop('checked', true);
                $('#moduleGTM').prop('checked', false);
                $('#moduleAFM').prop('checked', false);
                $('#moduleAPM').prop('checked', false);
                $('#moduleASM').prop('checked', false);
                $('#moduleAAM').prop('checked', false);
                $('#modulePEM').prop('checked', false);
                $('#moduleLC').prop('checked', false);
                break;
            }
            case "better":
            {
                $('#moduleLTM').prop('checked', true);
                $('#moduleGTM').prop('checked', true);
                $('#moduleAFM').prop('checked', true);
                $('#moduleAPM').prop('checked', false);
                $('#moduleASM').prop('checked', false);
                $('#moduleAAM').prop('checked', true);
                $('#modulePEM').prop('checked', false);
                $('#moduleLC').prop('checked', false);
                break;
            }
            case "best":
            {
                $('#moduleLTM').prop('checked', true);
                $('#moduleGTM').prop('checked', true);
                $('#moduleAFM').prop('checked', true);
                $('#moduleAPM').prop('checked', true);
                $('#moduleASM').prop('checked', true);
                $('#moduleAAM').prop('checked', true);
                $('#modulePEM').prop('checked', false);
                $('#moduleLC').prop('checked', false);
                break;
            }
        }
    });

    $('#moduleLC').change(function(){
        if($('#moduleLC').prop("checked")) {
            $('#moduleGTM').prop('checked', false);
            $('#moduleAFM').prop('checked', false);
            $('#moduleAPM').prop('checked', false);
            $('#moduleASM').prop('checked', false);
            $('#moduleAAM').prop('checked', false);
            $('#modulePEM').prop('checked', false);
            $('.nonLCModule').prop('checked', false);
            $('.nonLCModule').attr('disabled', true);
            $('.quickSelection').attr('disabled', true);
        }
        else if (!$('#moduleLC').prop("checked")) {
            $('.nonLCModule').attr('disabled', false);
            $('.quickSelection').attr('disabled', false);
        }
    });

    $("#buttonForrfpgen").on("click", function(e){
        e.preventDefault();
        $('#myForm').attr('action', "/rfpgen").submit();
    });

    $("#buttonFordeviationgen").on("click", function(e){
        e.preventDefault();
        $('#myForm').attr('action', "/deviationgen").submit();
    });
});



