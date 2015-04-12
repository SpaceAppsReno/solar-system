var container = document.getElementById("modelWindow");
var renderer	= new THREE.WebGLRenderer({
    antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );
renderer.shadowMapEnabled	= true;

var updateFcts	= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 1.5;

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
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

var currentMesh	= null;
var earthDefaultRotation = .004;
var currentRotation = earthDefaultRotation;
var cloud = null;
var ring = null;
function switchValue(type){
    currentMesh && scene.remove(currentMesh);
    scene.remove(ring);
    scene.remove(cloud);
    scene.remove(spotlight);
    ambiLight.color.setHex(0xffffff);
    if( type === 'Sun' ){
        var mesh	= THREEx.Planets.createSun();
        mesh.name = "Sun";
            currentRotation = earthDefaultRotation / 26;
    }else if( type === 'Mercury' ){
        var mesh	= THREEx.Planets.createMercury();
        mesh.name = 'Mercury';
        currentRotation = earthDefaultRotation / 58.625;
    }else if( type === 'Venus' ){
        var mesh	= THREEx.Planets.createVenus();
        currentRotation = (earthDefaultRotation / 116.75) * -1;
    }else if( type === 'Moon' ){
        var mesh	= THREEx.Planets.createMoon();
        currentRotation = earthDefaultRotation / 28;
    }else if( type === 'Earth' ){
        var mesh	= THREEx.Planets.createEarth();
        currentRotation = earthDefaultRotation;
        cloud	= THREEx.Planets.createEarthCloud();
        mesh.add(cloud)
    }else if( type === 'Mars' ){
        var mesh	= THREEx.Planets.createMars();
        currentRotation = earthDefaultRotation * 1.0277777;
    }else if( type === 'Jupiter' ){
        var mesh	= THREEx.Planets.createJupiter();
        currentRotation = earthDefaultRotation / 0.4166666;
    }else if( type === 'Saturn' ){
        var mesh	= THREEx.Planets.createSaturn();
        currentRotation = earthDefaultRotation / 0.4441666;
        mesh.receiveShadow	= true;
        mesh.castShadow		= true;
        scene.add(spotlight);
        ambiLight.color.setHex(0x222222);
        ring	= THREEx.Planets.createSaturnRing();
        ring.receiveShadow	= true;
        ring.castShadow		= true;
        scene.add(ring);
    }else if( type === 'Uranus' ){
        var mesh	= THREEx.Planets.createUranus();
        currentRotation = earthDefaultRotation / 0.71875;
        mesh.receiveShadow	= true;
        mesh.castShadow		= true;
        ring	= THREEx.Planets.createUranusRing();
        ring.receiveShadow	= true;
        ring.castShadow		= true;
        scene.add(spotlight);
        scene.add(ring);
        ambiLight.color.setHex(0x222222);
    }else if( type === 'Neptune' ){
        var mesh	= THREEx.Planets.createNeptune();
        currentRotation = earthDefaultRotation / 0.666666;
    }else	console.assert(false);
    scene.add(mesh);
    currentMesh	= mesh;
    location.hash	= type
}
var initialType	= location.hash.substr(1)	|| 'Earth';
switchValue(initialType);


//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var mouse	= {x : 0, y : 0}
document.addEventListener('mousemove', function(event){
    mouse.x	= (event.clientX / window.innerWidth ) - 0.5
    //mouse.y	= (event.clientY / window.innerHeight) - 0.5
}, false)
updateFcts.push(function(delta, now){
    camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
    //camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
    camera.lookAt( scene.position )
})


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
    // call each update function
    updateFcts.forEach(function(updateFn){
        updateFn(deltaMsec/1000, nowMsec/1000)
    })
})