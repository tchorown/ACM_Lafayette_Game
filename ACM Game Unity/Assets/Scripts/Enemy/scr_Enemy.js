#pragma strict

var maxHealth : int; // start health
var moveSpeed : int; // general movement speed
var attackSpeed : int; // time in between attacks
var damage : int; // the ammount of damage done by this actor
var armor : int; // resistance to damage
var range : int; // the range of bullets
var vision : int; // how far this actor can see
var playerScript : scr_Player;
internal var xSpeed : int; // how fast the object moves in the x direction
internal var ySpeed : int; // how fast the object moves in the y direction
internal var currentHealth : int; // current health
internal var collided_with : GameObject; // detects collisions

var bulletScript : scr_Bullet; // the script of the bullet
var pathfindingScript : scr_Pathfinding;

function Start () {
	// set health
	currentHealth = maxHealth;
	
	// find the player
	playerScript = GameObject.Find("obj_Player").GetComponent(scr_Player);
	
	// randomly generate speeds
	switch(System.Convert.ToInt32(Random.Range(0,2))) {
		case 0:
			xSpeed = moveSpeed;
			ySpeed = 0;
			break;
		
		case 1:
			xSpeed = 0;
			ySpeed = moveSpeed;
			break;
		
		case 2:
			xSpeed = moveSpeed;
			ySpeed = moveSpeed;
			break;
	
	}
}

function Update () {

	// check to see if player is in vision
	//Debug.Log(checkDistanceToPlayer());
	if (checkDistanceToPlayer() < vision) {
		//Debug.Log("I see you");
		dumbPathfinding(GameObject.Find("obj_Player"));
	}
	else{
	// check for collisions
	// check x
		if (reverseX()) {
			xSpeed = -xSpeed;
		}
		// check y
		else if (reverseY()){
			ySpeed = -ySpeed;
		}
		// move
		transform.Translate(Vector2(xSpeed * Time.deltaTime,ySpeed * Time.deltaTime));
	}
		
		// die if health is below 1
	if (currentHealth <= 0) {
		playerScript.killCount++;
		print(playerScript.killCount);
		playerScript.countText.text = "Kills: " + playerScript.killCount.ToString();
		Destroy(gameObject);
	}
}

// checks for X collision, returns boolean
function reverseX(){
	if ((Physics2D.Raycast(transform.position+Vector2(0,0),Vector2(-1,0),.55) && Physics2D.Raycast(transform.position+Vector2(0,-.5),Vector2(-1,0),.55)) || // left
			(Physics2D.Raycast(transform.position+Vector2(0,0),Vector2(1,0),.55) && Physics2D.Raycast(transform.position+Vector2(0,-.5),Vector2(1,0),.55))) { // right
				return true;
			} else return false;
}

// checks for Y collision, returns boolean
function reverseY(){
	if ((Physics2D.Raycast(transform.position+Vector2(.5,0),Vector2(0,1),.55) && Physics2D.Raycast(transform.position+Vector2(-.5,0),Vector2(0,1),.55)) // up
	 || (Physics2D.Raycast(transform.position+Vector2(.5,0),Vector2(0,-1),.55) && Physics2D.Raycast(transform.position+Vector2(-.5,0),Vector2(0,-1),.55))){  // down
		return true;
	} else return false;
}

function hitByBullet(bullet : GameObject){
	bulletScript = bullet.GetComponent(scr_Bullet);
		
	// calculate a hit or miss by checking to see if the bullet comes from the player AND it gets past the armor raiting
	if (bulletScript.attack + Random.Range(0,4) > armor && bulletScript.damageSource == Source.Player){
		// decrease health
		currentHealth -= bulletScript.damage + Random.Range(0,2);
	}
	
	// destroy bullet
	Destroy(bullet);
}

// checks how far away the player is from this actor
function checkDistanceToPlayer(){
	return Vector2.Distance(transform.position, GameObject.Find("obj_Player").transform.position);
}


function getVision()
{
	return moveSpeed;
}
//pathfinding for enemies, by no means optimal at the moment
//current issues:
//	they collide with the player and the player alone, walls do not stop these badass motherfuckers
//  their movement disregards their set moveSpeed
function dumbPathfinding(target:GameObject)
{
	if (checkDistanceToPlayer() >= 1) {
		var direction:Vector3 = transform.position - target.transform.position;
		var x:double = direction.x;
		var y:double = direction.y;
		
		var upHit:boolean = Physics2D.Raycast(transform.position, Vector2.up);
		var downHit:boolean = Physics2D.Raycast(transform.position, -Vector2.up);
		var leftHit:boolean = Physics2D.Raycast(transform.position, -Vector2.right);
		var rightHit:boolean = Physics2D.Raycast(transform.position, Vector2.right);
		
		if(upHit||downHit){
		transform.Translate(Vector2(-x*Time.deltaTime,0*Time.deltaTime));
		}
		
		if(leftHit||rightHit){
		transform.Translate(Vector2(0*Time.deltaTime,-y*Time.deltaTime));
		}
		
		else{
		transform.Translate(Vector2(-x*Time.deltaTime,-y*Time.deltaTime));
		}
	}
}
