var container = document.getElementById("modelWindow");
var renderer	= new THREE.WebGLRenderer({
    antialias	: true
});
renderer.setSize(window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );
renderer.shadowMapEnabled	= true;
var controls;

var updateFcts	= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 1.5;
controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.addEventListener('change', render);
var planetInfoText = document.getElementById("PlanetInfoParagraph");

window.addEventListener('resize',function() {onWindowResize();});
var ambiLight	= new THREE.AmbientLight( 'white' );
scene.add( ambiLight );

var spotlight	= new THREE.DirectionalLight( 0xcccccc, 1 )
spotlight.position.set(5,5,5)
spotlight.castShadow	= true
spotlight.shadowCameraNear	= 0.01
spotlight.shadowCameraFar	= 15
spotlight.shadowCameraFov	= 45

spotlight.shadowCameraLeft	= -1
spotlight.shadowCameraRight	=  1
spotlight.shadowCameraTop	=  1
spotlight.shadowCameraBottom= -1
// light.shadowCameraVisible	= true
spotlight.shadowBias	= 0.001
spotlight.shadowDarkness	= 0.2

spotlight.shadowMapWidth	= 1024*2
spotlight.shadowMapHeight	= 1024*2



//////////////////////////////////////////////////////////////////////////////////
//		added starfield							//
//////////////////////////////////////////////////////////////////////////////////


var starSphere	= THREEx.Planets.createStarfield();
scene.add(starSphere);

//////////////////////////////////////////////////////////////////////////////////
//		Change Settings and update models           							//
//////////////////////////////////////////////////////////////////////////////////

var currentMesh	= null;
var earthDefaultRotation = .004;
var currentRotation = earthDefaultRotation;
var cloud = null;
var ring = null;
var deviceOrientation = true;
var PlanetRotation = true;
function PlanetRotationSetting()
{
    PlanetRotation = !PlanetRotation;
    if (PlanetRotation == false)
    {
        earthDefaultRotation = 0;
        updateCurrentRotation(initialType);
    }
    else{
        earthDefaultRotation = .004;
        updateCurrentRotation(initialType);
    }
}
function updateCurrentRotation(type){
    if( type === 'Sun' ){
        currentRotation = earthDefaultRotation / 26;
    }else if( type === 'Mercury' ){
        currentRotation = earthDefaultRotation / 58.625;
    }else if( type === 'Venus' ){
        currentRotation = (earthDefaultRotation / 116.75) * -1;
    }else if( type === 'Moon' ){
        currentRotation = earthDefaultRotation / 28;
    }else if( type === 'Earth' ){
        currentRotation = earthDefaultRotation;
    }else if( type === 'Mars' ){
        currentRotation = earthDefaultRotation * 1.0277777;
    }else if( type === 'Jupiter' ){
        currentRotation = earthDefaultRotation / 0.4166666;
    }else if( type === 'Saturn' ){
        currentRotation = earthDefaultRotation / 0.4441666;
    }else if( type === 'Uranus' ){
        currentRotation = earthDefaultRotation / 0.71875;
    }else if( type === 'Neptune' ){
        currentRotation = earthDefaultRotation / 0.666666;
    }else	console.assert(false);
}
function DeviceOrientationSetting()
{
    deviceOrientation = !deviceOrientation;
}
var planetInfoString = GetPlanetInfoString(location.hash.substr(1)	|| 'Earth');
function GetPlanetInfoString(planet)
{
    var bodyArray = PlanetInfo[planet];
    planetInfoString = "";
    var jsonArray = JSON.stringify(bodyArray);
    JSON.parse(jsonArray,function(k,v){
        console.log("json parse hit",k,v);
        if (k != "") {
            planetInfoString += k + ": " + v + "\r\n";
        }
    });

    document.getElementById("PlanetInfoParagraph").innerText = planetInfoString;
}
function switchValue(type){
    currentMesh && scene.remove(currentMesh);
    scene.remove(ring);
    scene.remove(cloud);
    scene.remove(spotlight);
    ambiLight.color.setHex(0xffffff);
    if( type === 'Sun' ){
        var mesh	= THREEx.Planets.createSun();
        GetPlanetInfoString('Sun');
        mesh.name = "Sun";
    }else if( type === 'Mercury' ){
        GetPlanetInfoString('Mercury');
        var mesh	= THREEx.Planets.createMercury();
        mesh.name = 'Mercury';
    }else if( type === 'Venus' ){
        GetPlanetInfoString('Venus');
        var mesh	= THREEx.Planets.createVenus();
    }else if( type === 'Moon' ){
        GetPlanetInfoString('Moon');
        var mesh	= THREEx.Planets.createMoon();
    }else if( type === 'Earth' ){
        GetPlanetInfoString('Earth');
        var mesh	= THREEx.Planets.createEarth();
        cloud	= THREEx.Planets.createEarthCloud();
        mesh.add(cloud)
    }else if( type === 'Mars' ){
        GetPlanetInfoString('Mars');
        var mesh	= THREEx.Planets.createMars();
    }else if( type === 'Jupiter' ){
        GetPlanetInfoString('Jupiter');
        var mesh	= THREEx.Planets.createJupiter();
    }else if( type === 'Saturn' ){
        GetPlanetInfoString('Saturn');
        var mesh	= THREEx.Planets.createSaturn();
        mesh.receiveShadow	= true;
        mesh.castShadow		= true;
        scene.add(spotlight);
        ambiLight.color.setHex(0x222222);
        ring	= THREEx.Planets.createSaturnRing();
        ring.receiveShadow	= true;
        ring.castShadow		= true;
        scene.add(ring);
    }else if( type === 'Uranus' ){
        GetPlanetInfoString('Uranus');
        var mesh	= THREEx.Planets.createUranus();
        mesh.receiveShadow	= true;
        mesh.castShadow		= true;
        ring	= THREEx.Planets.createUranusRing();
        ring.receiveShadow	= true;
        ring.castShadow		= true;
        scene.add(spotlight);
        scene.add(ring);
        ambiLight.color.setHex(0x222222);
    }else if( type === 'Neptune' ){
        GetPlanetInfoString('Neptune');
        var mesh	= THREEx.Planets.createNeptune();
    }else	console.assert(false);

    updateCurrentRotation(type);
    scene.add(mesh);
    currentMesh	= mesh;
    location.hash	= type
}
var initialType	= location.hash.substr(1)	|| 'Earth';
switchValue(initialType);


//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//



//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////
updateFcts.push(function(){
    renderer.render( scene, camera );
})

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec	= nowMsec
    currentMesh.rotation.y += currentRotation;
    controls.update();
    // call each update function
    updateFcts.forEach(function(updateFn){
        updateFn(deltaMsec/1000, nowMsec/1000)
    })
});

function render() {

    renderer.render( scene, camera );
    //stats.update();

}

function onWindowResize() {

    console.log("window resized");
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}