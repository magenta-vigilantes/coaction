"""empty message

Revision ID: 5388a859c88
Revises: 2498c92eacc
Create Date: 2015-03-07 11:14:18.588251

"""

# revision identifiers, used by Alembic.
revision = '5388a859c88'
down_revision = '2498c92eacc'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('encrypted_password', sa.String(length=60), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.add_column('task', sa.Column('creator', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'task', 'user', ['creator'], ['id'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'task', type_='foreignkey')
    op.drop_column('task', 'creator')
    op.drop_table('user')
    ### end Alembic commands ###