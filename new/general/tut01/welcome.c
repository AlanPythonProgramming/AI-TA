#include <stdio.h>

#define SIZE 10

void print_parity(int num);

int main(void) {
    char message[] = "Welcome to COMP1531!";
    printf("%s\n", message);

    printf("Numbers from 1 to %d\n", SIZE);
    for (int num = 1; num <= SIZE; num++) {
        print_parity(num);
    }
    return 0;
}

void print_parity(int num) {
    if (num % 2 == 0) {
        printf("EVEN: %d\n", num);
    } else {
        printf("ODD: %d\n", num);
    }
}