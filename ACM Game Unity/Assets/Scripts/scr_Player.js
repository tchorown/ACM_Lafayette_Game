#pragma strict

var health : int = 100;
var speed : double = .5;
var bullet_pref : Transform; // prefab used for bullets
var fireRate : float = .5;
var nextShot : float = 0.0;

// for determining the direction of a bullet
public var left : int;
public var right : int;
public var up : int;
public var down : int;

function Start () {
	// set initial values
	left = 0;
	right = 0;
	up = 1;
	down = 0;
}

function Update () {	
	//     MOVE X
	// uses a raycast 1/2 the width of the sprite and checks for collisions.  If returns false, create a vector in that direction
	// right
	if (Input.GetAxis("Horizontal") > 0){
		if (!Physics.Raycast(transform.position+Vector3(0,.5,0),Vector3(1,0,0),.55) && !Physics.Raycast(transform.position+Vector3(0,-.5,0),Vector3(1,0,0),.55)){
			transform.Translate(Vector3(1 * speed * Time.deltaTime,0,0));
		} else DetectCollision();
		
		// update directional variables
		right = 1;
		left = 0;
	}
	
	// left
	if (Input.GetAxis("Horizontal") < 0){
		if (!Physics.Raycast(transform.position+Vector3(0,.5,0),Vector3(-1,0,0),.55) && !Physics.Raycast(transform.position+Vector3(0,-.5,0),Vector3(-1,0,0),.55)){
			transform.Translate(Vector3(-1 * speed * Time.deltaTime,0,0));
		} else DetectCollision();
		
		// update directional variables
		left = 1;
		right = 0;
	}
	
	//     MOVE Y
	// up
	if (Input.GetAxis("Vertical") > 0){
		if (!Physics.Raycast(transform.position+Vector3(.5,0,0),Vector3(0,1,0),.55) && !Physics.Raycast(transform.position+Vector3(-.5,0,0),Vector3(0,1,0),.55)){
			transform.Translate(Vector3(0,1 * speed * Time.deltaTime,0));
		} else DetectCollision();
		
		// update directional variables
		up = 1;
		down = 0;
	}
	
	// down
	if (Input.GetAxis("Vertical") < 0){
		if (!Physics.Raycast(transform.position+Vector3(.5,0,0),Vector3(0,-1,0),.55) && !Physics.Raycast(transform.position+Vector3(-.5,0,0),Vector3(0,-1,0),.55)){
			transform.Translate(Vector3(0,-1 * speed * Time.deltaTime,0));
		} else DetectCollision();
		
		// update directional variables
		down = 1;
		up = 0;
	}
	
	// the following methods ensure that there is no way for all directional values to be zero, which would prevent bullets from being shot.
	// these methods also prevent bullets from always being shot out of the corners of the player.
	if (Input.GetAxis("Horizontal") == 0 && Input.GetAxis("Vertical") != 0) {
		left = 0;
		right = 0;
	}
	
	if (Input.GetAxis("Vertical") == 0 && Input.GetAxis("Horizontal") != 0){
		up = 0;
		down = 0;
	}
	
	// shoot
	if (Input.GetAxis("FireBullet")){
	 	if (Time.time >= nextShot){
	 		// create an instance of the bullet
	 		Instantiate(bullet_pref,Vector3(transform.position.x,transform.position.y,0),Quaternion.identity);
	 		
	 		// prevent the player from firing again immediately
	 		nextShot = Time.time + fireRate;
		}
	}
	
}

function DetectCollision(){
	// this is for debugging purposes
	switch(System.Convert.ToInt32(Random.Range(0,4))){
		case 0:
		Debug.Log("Such collision");
		break;
		
		case 1:
		Debug.Log("Much fizziks");
		break;
		
		case 2:
		Debug.Log("Stopped doge");
		break;
		
		case 3:
		Debug.Log("Wow");
		break;
	}
	
}