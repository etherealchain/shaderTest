var scene, camera, renderer;
var geometry, material, mesh;
var canvas, stats;
var shaderMaterial;
var glow;
var smoothCubeGeom;

init();
animate();

function init() {

	scene = new THREE.Scene();
    stats = new Stats();
    canvas = document.createElement('div');

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	geometry = new THREE.BoxGeometry(200,200,200,2,2,2);
	material = new THREE.MeshBasicMaterial({color:0xff0000})
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 
		{ 
			"c":   { type: "f", value: 0.1 },
			"p":   { type: "f", value: 1.7 },
			glowColor: { type: "c", value: new THREE.Color(0xffff00) },
			viewVector: { type: "v3", value: camera.position }
		},
		vertexShader: document.getElementById( 'glowvs' ).textContent,
		fragmentShader: document.getElementById( 'glowfs' ).textContent,
		transparent: true,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending
	});

	smoothCubeGeom = geometry.clone();
	var modifier = new THREE.SubdivisionModifier( 2 );
	modifier.modify( smoothCubeGeom ); 

	glow = new THREE.Mesh(smoothCubeGeom, shaderMaterial.clone());
	glow.position = mesh.position;
	glow.scale.multiplyScalar(1.5);
	scene.add(glow);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
    
    canvas.appendChild(renderer.domElement);
    canvas.appendChild(stats.dom);
    document.body.appendChild(canvas);
}
function update(){

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	glow.rotation.x += 0.01;
	glow.rotation.y += 0.02;

	stats.update();
	glow.geometry.verticesNeedUpdate = true;
	glow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position, glow.position );
	
}
function render(){
	renderer.render( scene, camera );
}
function animate() {

	requestAnimationFrame( animate );
	
	update();
	render();
	
}