#pragma strict
var speed : int;
var xDir : int;
var yDir : int;
enum Source { Player, Ally, Enemy, Environment } // specifies the source
var damageSource : Source;
var attack : int; // likelyhood that the bulelt will hit
var damage : int; // damage of bullet
var player : GameObject;
var playerScript : scr_Player;
var playerMoveScript : scr_PlayerMove;
var collided_with : GameObject; // detects collisions
var horizDir : int;
var vertDir : int;
var moveVector : Vector2;
var targetAngle : float;

function Start (){
	// access the player's script
	playerScript = GameObject.Find("obj_Player").GetComponent(scr_Player);
	playerMoveScript = GameObject.Find("obj_Player").GetComponent(scr_PlayerMove);
	
	if (playerScript.targetType == Targeting.Keyboard) {
		// pull in components from the player
		horizDir = playerMoveScript.right - playerMoveScript.left;
		vertDir = playerMoveScript.up - playerMoveScript.down;
		
		// use directional values to move the bullet just off the edge of the player.  This way, it won't be created at the player's origin.
		transform.Translate(Vector2(.75*horizDir,.75*vertDir));
		
		// write the movement vector
		moveVector = Vector2(horizDir*speed * Time.deltaTime,vertDir*speed * Time.deltaTime);
	} else {
		transform.LookAt(playerScript.targetPosition);
		rigidbody2D.AddForce(transform.forward*1000);
		// save angle between player's target and the bullet
		//targetAngle = Vector2.Angle(transform.position,transform.position+playerScript.targetPosition);
		//targetAngle = Mathf.Deg2Rad*targetAngle; // convert to radians
		
		// save the movement vector
		//moveVector = Vector2(speed*Time.deltaTime*Mathf.Cos(targetAngle),speed*Time.deltaTime*Mathf.Sin(targetAngle));
	}
	
	// self-destruct after 1 second.  "gameObject" refers to the object assosiated with this script
	Destroy(gameObject,1);
	
	
}

function Update () {
	// move at the given speed in a certain direction
	transform.Translate(moveVector);
}

// destroy on collision
function OnTriggerEnter2D(col : Collider2D){
	Debug.Log("Much bullets very collide!");
	
	// save the collision
	collided_with = col.gameObject;
	
	// read tag of collided object
	if (collided_with.tag == "FullCollision") {
		// destroy self
		Destroy(gameObject);
	}
	
	if (collided_with.tag == "Enemy") {
		collided_with.GetComponent(scr_Enemy).hitByBullet(this.gameObject);
	}
}