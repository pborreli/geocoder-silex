$(function () {

    var providers = {
        free_geo_ip: {color:'blue'},
        host_ip: {color:'brown'},
        ip_info_db: {color:'purple'},
        yahoo:{color:'pink'},
        bing_maps:{color:'orange'},
        google_maps:{color:'red'},
        cloudmade:{color:'yellow'},
        openstreetmaps:{color:'green'}
};
    $('#gmap').gmap3({zoom:3});
    $('form').on('submit', function (event) {
        event.preventDefault();
        $('#gmap').gmap3({action:'clear', name:'marker'});
        $('#gmap').gmap3({action:'clear', name:'rectangle'});
        $.ajax({
            type:'POST',
            dataType:'JSON',
            data:{q:$('#q').val()},
            success:function (data) {
                //$('.result').html(data);
                $.each(data, function (provider, result) {
                    if (result['latitude'] != 0) {
                        var infowindow;
                        var marker;
                        var map = $('#gmap').gmap3({
                            action:'addMarker',
                            latLng:[result['latitude'], result['longitude']],
                            options:{
                                draggable:false,
                                animation:google.maps.Animation.DROP,
                                icon:'/images/markers/'+providers[provider].color+'_Marker' + provider.charAt(0).toUpperCase() + '.png'
                            },
                            events:{
                                mouseover:function (marker, event, data) {
                                    infowindow = $(this).gmap3({action:'get', name:'infowindow'});
                                    map = $(this).gmap3('get');
                                    if (infowindow) {
                                        infowindow.open(map, marker);
                                        infowindow.setContent(provider);
                                    } else {
                                        $(this).gmap3({action:'addinfowindow', anchor:marker, options:{content:provider}});
                                    }
                                },
                                mouseout:function () {
                                    infowindow = $(this).gmap3({action:'get', name:'infowindow'});
                                    if (infowindow) {
                                        infowindow.close();
                                    }
                                }
                            }
                        });
                        marker = $('#gmap').gmap3({action:'get', name:'marker'})
                        if (null != result['bounds']) {
                            $('#gmap').gmap3({
                                action:'addRectangle',
                                options:{
                                    bounds:[result['bounds']['north'], result['bounds']['east'], result['bounds']['south'], result['bounds']['west']],
                                    fillColor: providers[provider].color,
                                    strokeColor: providers[provider].color,
                                    clickable:true
                                },
                                events:{
                                    mouseover:function (event) {
                                        infowindow = $(this).gmap3({action:'get', name:'infowindow'});
                                        map = $(this).gmap3('get');
                                        if (infowindow) {
                                            infowindow.open(map, marker);
                                            infowindow.setContent(provider);
                                        } else {
                                            $(this).gmap3({action:'addinfowindow', anchor:marker, options:{content:provider}});
                                        }
                                    },
                                    mouseout:function (event) {
                                        infowindow = $(this).gmap3({action:'get', name:'infowindow'});
                                        if (infowindow) {
                                            infowindow.close();
                                        }
                                    }
                                }
                            });
                        }

                    }
                });
                $('#gmap').gmap3('autofit');
            }
        });
    });
    $('#ip').on('click', function (event) {
        event.preventDefault();
        $('#q').val($(this).data('ip'));
        $('form').submit();
    })
});