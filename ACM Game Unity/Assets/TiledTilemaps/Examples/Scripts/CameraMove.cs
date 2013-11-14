using UnityEngine;
using System.Collections;

public class CameraMove : MonoBehaviour {
	
	public float moveSpeed = 10f;
	private int phase = 1;
	
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if(transform.position.x < 26.34f && transform.position.y == 0) {
			transform.position += transform.right * moveSpeed * Time.deltaTime;
		}
		else if(transform.position.y > -30.05f && transform.position.x >= 26.34f) {
			transform.position += transform.up * -1 * moveSpeed * Time.deltaTime;
		}
		else if(transform.position.y <= -30.05f && transform.position.x > -0.88) {
			transform.position += transform.right * -1 * moveSpeed * Time.deltaTime;
		}
		else if(transform.position.x <= -0.88f && transform.position.y <= 0f) {
			transform.position += transform.up * moveSpeed * Time.deltaTime;
		}
	}
}
