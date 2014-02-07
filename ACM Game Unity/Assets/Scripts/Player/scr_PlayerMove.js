#pragma strict

var moveForce : float = 365f; // determines force added
var speed : double = .5; // max speed

// for determining the direction of a bullet
internal var left : int;
internal var right : int;
internal var up : int;
internal var down : int;

// components
var animator : Animator;

function Start () {
	// set initial values
	left = 0;
	right = 0;
	up = 1;
	down = 0;
	
	// save reference to animator
	animator = GetComponent(Animator);
}

function Update () {
	// change animation	
	ChangeSpriteDirection();
	
	if (Input.GetAxis("Vertical") == 0 && Input.GetAxis("Horizontal") != 0){
		up = 0;
		down = 0;
	}
	
	// Cache the horizontal input.
	var h : float = Input.GetAxis("Horizontal");
	var v : float = Input.GetAxis("Vertical");

	// The Speed animator parameter is set to the absolute value of the horizontal input.
	//anim.SetFloat("Speed", Mathf.Abs(h));
	
	// If the player is changing direction (h has a different sign to velocity.x) or hasn't reached maxSpeed yet...
	if(h * rigidbody2D.velocity.x < speed)
		// ... add a force to the player.
		rigidbody2D.AddForce(Vector2.right * h * moveForce);

	// If the player's horizontal velocity is greater than the maxSpeed...
	if(Mathf.Abs(rigidbody2D.velocity.x) > speed)
		// ... set the player's velocity to the maxSpeed in the x axis.
		rigidbody2D.velocity = new Vector2(Mathf.Sign(rigidbody2D.velocity.x) * speed, rigidbody2D.velocity.y);
		
	// set to zero
	if (h == 0) {
		rigidbody2D.velocity = new Vector2(0,rigidbody2D.velocity.y);
		if (v != 0) {
			left = 0;
			right = 0;
		}
	}
	
	// set direction
	if (h > 0) {
		right = 1;
		left = 0;
	}
	
	if (h < 0) {
		left = 1;
		right = 0;
	}

// Cache the vertical input.
	// The Speed animator parameter is set to the absolute value of the horizontal input.
	//anim.SetFloat("Speed", Mathf.Abs(h));
	
	// If the player is changing direction (h has a different sign to velocity.x) or hasn't reached maxSpeed yet...
	if(v * rigidbody2D.velocity.y < speed)
		// ... add a force to the player.
		rigidbody2D.AddForce(Vector2.up * v * moveForce);

	// If the player's horizontal velocity is greater than the maxSpeed...
	if(Mathf.Abs(rigidbody2D.velocity.y) > speed)
		// ... set the player's velocity to the maxSpeed in the x axis.
		rigidbody2D.velocity = new Vector2(rigidbody2D.velocity.x,Mathf.Sign(rigidbody2D.velocity.y) * speed);
	
	// set direction
	if (v > 0) {
		up = 1;
		down = 0;
	}
	
	if (v < 0) {
		down = 1;
		up = 0;
	}

	// set to zero
	if (v == 0) {
		rigidbody2D.velocity = new Vector2(rigidbody2D.velocity.x,0);
	
		if (h != 0) {
			up = 0;
			down = 0;
		}
	}
}
		
// send values into animator
function ChangeSpriteDirection(){
	// right
	animator.SetInteger("right", right);
	
	// left
	animator.SetInteger("left", left);
	
	// up
	animator.SetInteger("up", up);
	
	// down
	animator.SetInteger("down", down);
	
}