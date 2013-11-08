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
	// move
	transform.Translate(Vector3(xSpeed * Time.deltaTime,ySpeed * Time.deltaTime,0));
	
	
	// die if health is below 1
	if (health <= 0) {
		Destroy(gameObject);
		
		// print to console
		Debug.Log("Such dead.");
	}
}

function OnCollisionEnter(col : Collision){
	Debug.Log("Such hit");
	// save the collision
	collided_with = col.gameObject;
	
	// read tag of collision
	switch (collided_with.tag) {
		case "Projectile" :
			// decrease health and destroy other
			health -= 5;
			Destroy(collided_with);
			break;
	
		case "FullCollision":
			// reverses speed
			xSpeed = -xSpeed;
			ySpeed = -ySpeed;
			Debug.Log("Such detected");
			break;
	}
}
