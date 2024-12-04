vec3 fromLngLat(vec2 lngLat, float altitude) {
    float lng = (180.0 + lngLat.x) / 360.0;
    float lat = (180.0 - (180.0 / PI * log(tan(PI / 4.0 + lngLat.y * PI / 360.0)))) / 360.0;
    float earthRadius = 6371008.8;
    float earthCircumference = 2.0 * PI * earthRadius;
    float alti = altitude / (earthCircumference * cos(lngLat.y * PI / 180.0));
    return vec3(lng, lat, alti);
}