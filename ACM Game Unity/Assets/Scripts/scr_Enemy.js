#pragma strict
var collided_with : GameObject; // detects collisions
var health : int; // enemy health
var xSpeed : int; // how fast the object moves in the x direction
var ySpeed : int; // how fast the object moves in the y direction

function Start () {
	// randomly generate speeds
	switch(System.Convert.ToInt32(Random.Range(0,2))) {
		case 0:
			xSpeed = 1;
			ySpeed = 0;
			break;
		
		case 1:
			xSpeed = 0;
			ySpeed = 1;
			break;
		
		case 2:
			xSpeed = 1;
			ySpeed = 1;
			break;
	
	}
}

function Update () {
	// check for collisions
	// check x
	if (reverseX()) {
		xSpeed = -xSpeed;
	}
	// check y
	if (reverseY()){
		ySpeed = -ySpeed;
	}
	// move
	transform.Translate(Vector2(xSpeed * Time.deltaTime,ySpeed * Time.deltaTime));
	
	
	// die if health is below 1
	if (health <= 0) {
		Destroy(gameObject);
		
		// print to console
		Debug.Log("Such dead.");
	}
}

// checks for X collision, returns boolean
function reverseX(){
	if ((Physics2D.Raycast(transform.position+Vector2(0,0),Vector2(-1,0),.55) && Physics2D.Raycast(transform.position+Vector2(0,-.5),Vector2(-1,0),.55)) || // left
			(Physics2D.Raycast(transform.position+Vector2(0,0),Vector2(1,0),.55) && Physics2D.Raycast(transform.position+Vector2(0,-.5),Vector2(1,0),.55))) { // right
				Debug.Log("Much reversal so X");
				return true;
			} else return false;
}

// checks for Y collision, returns boolean
function reverseY(){
	if ((Physics2D.Raycast(transform.position+Vector2(.5,0),Vector2(0,1),.55) && Physics2D.Raycast(transform.position+Vector2(-.5,0),Vector2(0,1),.55)) // up
	 || (Physics2D.Raycast(transform.position+Vector2(.5,0),Vector2(0,-1),.55) && Physics2D.Raycast(transform.position+Vector2(-.5,0),Vector2(0,-1),.55))){  // down
		Debug.Log("Much reversal so Y");
		return true;
	} else return false;
}

function OnCollisionEnter2D(col : Collision2D){
	Debug.Log("Such hit");
	// save the collision
	collided_with = col.gameObject;
	
	Debug.Log("Wow collision");
	
	// read tag of collision
	switch (collided_with.tag) {
		case "Projectile" :
			// decrease health and destroy other
			health -= 5;
			Destroy(collided_with);
			break;
	
		/*case "FullCollision":
			// reverses speed
			xSpeed = -xSpeed;
			ySpeed = -ySpeed;
			Debug.Log("Such detected");
			break;*/
	}
}
